

# **************** IMPORT PACKAGES ********************
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_bcrypt import Bcrypt
from config import ApplicationConfig
from model import db, User
import random
import os
import warnings
import nltk
from statsmodels.tsa.arima.model import ARIMA
from textblob import TextBlob
from sklearn.linear_model import LinearRegression
import re
import yfinance as yf
import datetime as dt
from datetime import datetime
from flask import Flask, jsonify, render_template, request, flash, redirect, url_for, session
from flask_mail import Mail, Message
from alpha_vantage.timeseries import TimeSeries
import pandas as pd
import numpy as np
import requests
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense
from sklearn.preprocessing import MinMaxScaler
import math
import matplotlib.pyplot as plt
import requests
plt.style.use('ggplot')

nltk.download('punkt')

# Ignore Warnings
warnings.filterwarnings("ignore")

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ************ FLASK *****************
app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)
with app.app_context():
    db.create_all()


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    })


# Configure Flask-Mail settings
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'itlearnix@gmail.com'
app.config['MAIL_PASSWORD'] = 'veyqttrtaoahxsga'
app.config['MAIL_DEFAULT_SENDER'] = 'itlearnix@gmail.com'

# Configure the OAuth instances
mail = Mail(app)

# To control caching so as to save and retrieve plot figs on client side


@app.after_request
def add_header(response):
    response.headers['Pragma'] = 'no-cache'
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Expires'] = '0'
    return response


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/stock-predictions')
def stock_predictions():
    return render_template('stock-predictions.html')


@app.route('/coinvert')
def coinvert():
    return render_template('coinvert.html')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/allStock', methods=['GET'])
def getAllStock():
    url = "https://twelve-data1.p.rapidapi.com/stocks"
    querystring = {"exchange": "NASDAQ", "format": "json"}

    headers = {
        "X-RapidAPI-Key": "b5d4927c0emsh1f0acff2027d55cp1d7c9ajsn4bb2a0645707",
        "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        data = response.json()
        return jsonify(data)  # Convert the data to a JSON response
    else:
        # Return an error response with status code 500
        return jsonify({"error": "Failed to fetch data from the external API"}), 500


@app.route('/contact-form', methods=['POST'])
def contact_form():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        # Create the email message for team member
        team_subject = 'New Contact Form Submission'
        team_body = f"Name: {name}\nEmail: {email}\nSubject: {subject}\nMessage: {message}"
        team_recipients = ['yadavnikhilrao@gmail.com']

        # Send email to team member
        team_msg = Message(subject=team_subject,
                           body=team_body, recipients=team_recipients)
        mail.send(team_msg)

        return render_template('message-sent.html')


@app.route('/stockDataDeatil', methods=['POST'])
def stocDetail():
    symbol = request.json['symbol']
    interval = request.json['interval']

    url = "https://twelve-data1.p.rapidapi.com/time_series"

    querystring = {"symbol": {symbol}, "interval": {interval},
                   "outputsize": "30", "format": "json"}

    headers = {
        "X-RapidAPI-Key": "b5d4927c0emsh1f0acff2027d55cp1d7c9ajsn4bb2a0645707",
        "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        data = response.json()
        return jsonify(data)  # Convert the data to a JSON response
    else:
        # Return an error response with status code 500
        return jsonify({"error": "Failed to fetch data from the external API"}), 500


@app.route("/result", methods=['POST'])
def result():
    symbol = request.json['symbol']

    # **************** FUNCTIONS TO FETCH DATA ***************************

    def get_historical(quote):
        end = datetime.now()
        start = datetime(end.year - 2, end.month, end.day)
        data = yf.download(quote, start=start, end=end)
        df = pd.DataFrame(data=data)
        df.to_csv('' + quote + '.csv')
        if df.empty:
            ts = TimeSeries(key='N6A6QT6IBFJOPJ70', output_format='pandas')
            data, meta_data = ts.get_daily_adjusted(
                symbol='NSE:' + quote, outputsize='full')
            # Format df
            # Last 2 yrs rows => 502, in ascending order => ::-1
            data = data.head(503).iloc[::-1]
            data = data.reset_index()
            # Keep Required cols only
            df = pd.DataFrame()
            df['Date'] = data['date']
            df['Open'] = data['1. open']
            df['High'] = data['2. high']
            df['Low'] = data['3. low']
            df['Close'] = data['4. close']
            df['Adj Close'] = data['5. adjusted close']
            df['Volume'] = data['6. volume']
            df.to_csv('' + quote + '.csv', index=False)
        return

    # ******************** ARIMA SECTION ********************

    # Define the parser function
    def parser(x):
        return datetime.strptime(x, '%Y-%m-%d')

    # ************* ARIMA SECTION ********************

    def ARIMA_ALGO(df):
        uniqueVals = df["Code"].unique()
        len(uniqueVals)
        df = df.set_index("Code")

        def arima_model(train, test):
            history = [x for x in train]
            predictions = list()
            for t in range(len(test)):
                model = ARIMA(history, order=(6, 1, 0)).fit()
                output = model.forecast()
                yhat = output[0]
                predictions.append(yhat)
                obs = test[t]
                history.append(obs)
            return predictions

        for company in uniqueVals[:10]:
            data = (df.loc[company, :]).reset_index()
            data['Price'] = data['Close']
            Quantity_date = data[['Price', 'Date']]
            Quantity_date.index = Quantity_date['Date'].map(
                lambda x: datetime.strptime(x, '%Y-%m-%d'))
            Quantity_date['Price'] = Quantity_date['Price'].map(
                lambda x: float(x))
            Quantity_date = Quantity_date.fillna(Quantity_date.bfill())
            Quantity_date = Quantity_date.drop(['Date'], axis=1)

            fig = plt.figure(figsize=(10.2, 6), dpi=65)
            plt.plot(Quantity_date)
            plt.savefig('static/Trends.png')
            plt.close(fig)

            quantity = Quantity_date.values
            size = int(len(quantity) * 0.80)
            train, test = quantity[0:size], quantity[size:len(quantity)]

            predictions = arima_model(train, test)

            fig = plt.figure(figsize=(10.2, 6), dpi=65)
            plt.plot(test, label='Actual Price')
            plt.plot(predictions, label='Predicted Price')
            plt.legend(loc=4)
            plt.savefig('static/ARIMA.png')
            plt.close(fig)
            print()
            arima_pred = predictions[-2]
            print("Tomorrow's", quote,
                  " Closing Price Prediction by ARIMA:", arima_pred)
            # rmse calculation
            error_arima = math.sqrt(mean_squared_error(test, predictions))
            print("ARIMA RMSE:", error_arima)
            return arima_pred, error_arima, Quantity_date

    # ************* LSTM SECTION **********************

    def LSTM_ALGO(df):
        dataset_train = df.iloc[0:int(0.8 * len(df)), :]
        dataset_test = df.iloc[int(0.8 * len(df)):, :]
        training_set = dataset_train.iloc[:, 4:5].values

        sc = MinMaxScaler(feature_range=(0, 1))
        training_set_scaled = sc.fit_transform(training_set)

        X_train = []
        y_train = []
        for i in range(7, len(training_set_scaled)):
            X_train.append(training_set_scaled[i - 7:i, 0])
            y_train.append(training_set_scaled[i, 0])
        X_train = np.array(X_train)
        y_train = np.array(y_train)

        X_forecast = np.append(X_train[-1, 1:], y_train[-1])
        X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
        X_forecast = np.reshape(X_forecast, (1, X_forecast.shape[0], 1))

        regressor = Sequential()
        regressor.add(LSTM(units=50, return_sequences=True,
                      input_shape=(X_train.shape[1], 1)))
        regressor.add(Dropout(0.1))
        regressor.add(LSTM(units=50, return_sequences=True))
        regressor.add(Dropout(0.1))
        regressor.add(LSTM(units=50, return_sequences=True))
        regressor.add(Dropout(0.1))
        regressor.add(LSTM(units=50))
        regressor.add(Dropout(0.1))
        regressor.add(Dense(units=1))

        regressor.compile(optimizer='adam', loss='mean_squared_error')
        regressor.fit(X_train, y_train, epochs=25, batch_size=32)

        real_stock_price = dataset_test.iloc[:, 4:5].values

        dataset_total = pd.concat(
            (dataset_train['Close'], dataset_test['Close']), axis=0)
        testing_set = dataset_total[len(
            dataset_total) - len(dataset_test) - 7:].values
        testing_set = testing_set.reshape(-1, 1)

        testing_set = sc.transform(testing_set)

        X_test = []
        for i in range(7, len(testing_set)):
            X_test.append(testing_set[i - 7:i, 0])
        X_test = np.array(X_test)
        X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

        predicted_stock_price = regressor.predict(X_test)
        predicted_stock_price = sc.inverse_transform(predicted_stock_price)

        fig = plt.figure(figsize=(10.2, 6), dpi=65)
        plt.plot(real_stock_price, label='Actual Price')
        plt.plot(predicted_stock_price, label='Predicted Price')
        plt.legend(loc=4)
        plt.savefig('static/LSTM.png')
        plt.close(fig)

        error_lstm = math.sqrt(mean_squared_error(
            real_stock_price, predicted_stock_price))

        forecasted_stock_price = regressor.predict(X_forecast)
        forecasted_stock_price = sc.inverse_transform(forecasted_stock_price)

        lstm_pred = forecasted_stock_price[0, 0]
        print()
        print("Tomorrow's", quote, "Closing Price Prediction by LSTM:", lstm_pred)
        print("LSTM RMSE:", error_lstm)
        return lstm_pred, error_lstm

    # ***************** LINEAR REGRESSION SECTION ******************

    def LIN_REG_ALGO(df):
        # No of days to be forcasted in future
        forecast_out = int(7)
        # Price after n days
        df['Close after n days'] = df['Close'].shift(-forecast_out)
        # New df with only relevant data
        df_new = df[['Close', 'Close after n days']]

        # Structure data for train, test & forecast
        # lables of known data, discard last 35 rows
        y = np.array(df_new.iloc[:-forecast_out, -1])
        y = np.reshape(y, (-1, 1))
        # all cols of known data except lables, discard last 35 rows
        X = np.array(df_new.iloc[:-forecast_out, 0:-1])
        # Unknown, X to be forecasted
        X_to_be_forecasted = np.array(df_new.iloc[-forecast_out:, 0:-1])

        # Traning, testing to plot graphs, check accuracy
        X_train = X[0:int(0.8*len(df)), :]
        X_test = X[int(0.8*len(df)):, :]
        y_train = y[0:int(0.8*len(df)), :]
        y_test = y[int(0.8*len(df)):, :]

        # Feature Scaling===Normalization
        from sklearn.preprocessing import StandardScaler
        sc = StandardScaler()
        X_train = sc.fit_transform(X_train)
        X_test = sc.transform(X_test)

        X_to_be_forecasted = sc.transform(X_to_be_forecasted)

        # Training
        clf = LinearRegression(n_jobs=-1)
        clf.fit(X_train, y_train)

        # Testing
        y_test_pred = clf.predict(X_test)
        y_test_pred = y_test_pred*(1.04)
        import matplotlib.pyplot as plt2
        fig = plt2.figure(figsize=(10.2, 6), dpi=65)
        plt2.plot(y_test, label='Actual Price')
        plt2.plot(y_test_pred, label='Predicted Price')

        plt2.legend(loc=4)
        plt2.savefig('static/LR.png')
        plt2.close(fig)

        error_lr = math.sqrt(mean_squared_error(y_test, y_test_pred))

        # Forecasting
        forecast_set = clf.predict(X_to_be_forecasted)
        forecast_set = forecast_set*(1.04)
        mean = forecast_set.mean()
        lr_pred = forecast_set[0, 0]
        print()
        print("Tomorrow's ", quote,
              " Closing Price Prediction by Linear Regression: ", lr_pred)
        print("Linear Regression RMSE:", error_lr)
        return df, lr_pred, forecast_set, mean, error_lr

    # **************** SENTIMENT ANALYSIS **************************

    def retrieve_news_sentiment(symbol, api_key):

        # Define the URL for the news API
        news_api_url = f'https://newsapi.org/v2/everything?q={symbol} stock&apiKey={api_key}'

        try:
            # Send an HTTP GET request to the news API
            response = requests.get(news_api_url)

            if response.status_code == 200:
                # Parse the JSON response
                news_data = response.json()

                # Check if news articles are available
                if 'articles' in news_data and len(news_data['articles']) > 0:
                    news_list = []  # List of news headlines alongside polarity
                    global_polarity = 0  # Polarity of all news headlines
                    news_headlines_list = []  # List of news headlines only
                    pos = 0  # Num of positive headlines
                    neg = 0  # Num of negative headlines
                    neutral = 0  # Num of neutral headlines

                    for article in news_data['articles']:
                        news_text = article['title']

                        # Analyze the sentiment of the news headline
                        analysis = TextBlob(news_text)
                        polarity = analysis.sentiment.polarity
                        global_polarity += polarity

                        # Categorize the sentiment of the news headline
                        if polarity > 0:
                            sentiment = "Positive"
                            pos += 1
                        elif polarity < 0:
                            sentiment = "Negative"
                            neg += 1
                        else:
                            sentiment = "Neutral"
                            neutral += 1

                        news_list.append((news_text, sentiment))
                        news_headlines_list.append(news_text)

                    # Determine the overall sentiment based on global_polarity
                    if global_polarity > 0:
                        overall_sentiment = "Overall Positive"
                    elif global_polarity < 0:
                        overall_sentiment = "Overall Negative"
                    else:
                        overall_sentiment = "Overall Neutral"

                    # Create a pie chart for sentiment analysis
                    sentiment_data = pd.DataFrame({'Sentiment': ['Positive', 'Negative', 'Neutral'],
                                                   'Count': [pos, neg, neutral]})
                    plt.figure(figsize=(4.9, 4.9))
                    plt.pie(
                        sentiment_data['Count'], labels=sentiment_data['Sentiment'], autopct='%1.1f%%', startangle=100)
                    # Equal aspect ratio ensures that pie is drawn as a circle.
                    plt.axis('equal')

                    # Save the figure as 'static/SA.png'
                    plt.savefig('static/SA.png')

                    # Close the figure
                    plt.close()

                    return global_polarity, news_list, overall_sentiment, pos, neg, neutral
                else:
                    return 0, [], "No News Found", 0, 0, 0
            else:
                return 0, [], f"Failed to Fetch News (Status Code: {response.status_code})", 0, 0, 0

        except Exception as e:
            return 0, [], f"Error: {str(e)}", 0, 0, 0

    def recommending(df, global_polarity, today_stock, mean):
        if today_stock.iloc[-1]['Close'] < mean:
            if global_polarity > 0:
                idea = "RISE"
                decision = "BUY"
                print()
                print(
                    "##############################################################################")
                print("According to the ML Predictions and Sentiment Analysis of News, a",
                      idea, "in", quote, "stock is expected => ", decision)
            elif global_polarity <= 0:
                idea = "FALL"
                decision = "SELL"
                print()
                print("According to the ML Predictions and Sentiment Analysis of News, a",
                      idea, "in", quote, "stock is expected => ", decision)
        else:
            idea = "FALL"
            decision = "SELL"
            print()
            print("According to the ML Predictions and Sentiment Analysis of News, a",
                  idea, "in", quote, "stock is expected => ", decision)
        return idea, decision

    # **************GET DATA ***************************************

    quote = symbol

    # Try-except to check if valid stock symbol
    try:
        get_historical(quote)
    except:
        return render_template('stock-predictions.html', msg="Stock Symbol Not Found. Please Enter a Valid Stock Symbol")
    else:

        # ************** PREPROCESSUNG ***********************

        df = pd.read_csv(''+quote+'.csv')
        print("Today's", quote, "Stock Data: ")
        today_stock = df.iloc[-1:]
        print(today_stock)
        df = df.dropna()
        code_list = []
        for i in range(0, len(df)):
            code_list.append(quote)
        df2 = pd.DataFrame(code_list, columns=['Code'])
        df2 = pd.concat([df2, df], axis=1)
        df = df2

        arima_pred, error_arima, Quantity_date = ARIMA_ALGO(df)
        lstm_pred, error_lstm = LSTM_ALGO(df)
        df, lr_pred, forecast_set, mean, error_lr = LIN_REG_ALGO(df)

        # Assuming you have an 'api_key' variable defined with your API key
        api_key = '15a2cd458fe340a78d812cc5b50ef6bf'
        # symbol = quote

        # Call the retrieve_news_sentiment function with the 'api_key' argument
        polarity, news_list, overall_sentiment, pos, neg, neutral = retrieve_news_sentiment(
            quote, api_key)

        idea, decision = recommending(df, polarity, today_stock, mean)
        print()
        print("Forecasted Prices for Next 7 days:")
        print(forecast_set)
        today_stock = today_stock.round(2)
        arima_pred = float(round(arima_pred, 2))
        lstm_pred = float(round(lstm_pred, 2))
        error_lr = float(round(error_lr, 2))
        error_lstm = float(round(error_lstm, 2))
        error_arima = float(round(error_arima, 2))
        forecast_set = forecast_set.tolist()
        lr_pred = float(round(lr_pred, 2))
        quantity_date_objects = Quantity_date.reset_index().to_dict(orient='records')
        return jsonify({
            "quote": quote,
            "arima_pred": arima_pred,
            "lstm_pred": lstm_pred,
            "lr_pred": lr_pred,
            "open_s": today_stock['Open'].to_string(index=False),
            "close_s": today_stock['Close'].to_string(index=False),
            "adj_close": today_stock['Adj Close'].to_string(index=False),
            "news_list": news_list,
            "overall_sentiment": overall_sentiment,
            "idea": idea,
            "decision": decision,
            "high_s": today_stock['High'].to_string(
                index=False),
            "low_s": today_stock['Low'].to_string(index=False),
            "vol": today_stock['Volume'].to_string(index=False),
            "forecast_set": forecast_set,
            "error_lr": error_lr,
            "error_lstm": error_lstm,
            "error_arima": error_arima,
            "quantityDate": quantity_date_objects

        })
        # return render_template('result.html', quote=quote, arima_pred=round(arima_pred, 2), lstm_pred=round(lstm_pred, 2),
        #                        lr_pred=round(lr_pred, 2), open_s=today_stock['Open'].to_string(index=False),
        #                        close_s=today_stock['Close'].to_string(index=False), adj_close=today_stock['Adj Close'].to_string(index=False),
        #                        news_list=news_list, overall_sentiment=overall_sentiment, idea=idea, decision=decision, high_s=today_stock['High'].to_string(
        #                            index=False),
        #                        low_s=today_stock['Low'].to_string(index=False), vol=today_stock['Volume'].to_string(index=False),
        #                        forecast_set=forecast_set, error_lr=round(error_lr, 2), error_lstm=round(error_lstm, 2), error_arima=round(error_arima, 2))


if __name__ == '__main__':
    app.run()