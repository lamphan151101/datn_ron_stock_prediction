# **************** IMPORT PACKAGES ********************
from scipy.special import softmax
import matplotlib
from flask_apscheduler import APScheduler
from flask_cors import CORS, cross_origin
from flask_session import Session
from flask_bcrypt import Bcrypt
from config import ApplicationConfig
from model import db, User, WatchList, StockValue, Stock
import random
import os
import warnings
import nltk
from tensorflow import keras
from tensorflow.keras.layers import LSTM, Bidirectional, Reshape
seed = 42
from keras.models import Sequential
import tensorflow as tf
from keras.layers import LSTM, Dropout, Dense
from sklearn.preprocessing import MinMaxScaler
from keras.layers import LSTM, Conv1D, Conv2D, MaxPooling2D, MaxPooling1D, Flatten
import string
from statsmodels.tsa.arima.model import ARIMA
from textblob import TextBlob
from sklearn.linear_model import LinearRegression
import re
import seaborn as sns
import yfinance as yf
import datetime as dt
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request, flash, redirect, url_for, session, make_response
from flask_mail import Mail, Message
from alpha_vantage.timeseries import TimeSeries
import pandas as pd
import numpy as np
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dropout, Dense
from sklearn.preprocessing import MinMaxScaler
import math
import matplotlib.pyplot as plt
import requests
import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from pmdarima import auto_arima
from statsmodels.tools.sm_exceptions import ConvergenceWarning
from functools import wraps
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sentimentModel.sentimentCombineLSTM import sentimentCombine
from sentimentModel.sentimentCombineLSTM3days import sentimentCombineThreeDays

plt.style.use('ggplot')

nltk.download('punkt')

# Ignore Warnings
warnings.filterwarnings("ignore")

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ************ FLASK *****************
app = Flask(__name__)
app.config.from_object(ApplicationConfig)
sched = APScheduler()
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


def token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = request.args.get('token')
        print(f"Received token: {token}")
        print("secret key in jwt: ")
        print(app.config['SECRET_KEY'])

        if token is None:
            return jsonify({"error": "Token is missing"}), 401

        try:
            print("start: ")
            print(token)
            data = jwt.decode(
                token, app.config['SECRET_KEY'], algorithms=['HS256'])
            print(data)
            print("secret key in jwt: ")
            print(app.config['SECRET_KEY'])
            # current_user = User.query.filter_by(email=data['user']).first()
        except:
            return jsonify({'error'}), 403

        return fn(*args, **kwargs)

    return wrapper


@app.route("/protec")
@token_required
def protec():
    return jsonify({"mess": "protec success"})


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    # Generate JWT token
    token = jwt.encode({
        'user': email,
        'expiration': str(datetime.utcnow() + timedelta(minutes=30))
    }, app.config['SECRET_KEY'])
    print("secret key in login user: ")
    print(app.config['SECRET_KEY'])

    # Set the session or return the token, depending on your use case
    session["user_id"] = user.id
    return jsonify({
        "id": user.id,
        "email": user.email,
        "token": token
    })


@app.route("/add_watch_list", methods=["POST"])
def add_watchlist():
    symbol = request.json["symbol"]
    exist_watchlist = WatchList.query.filter_by(
        symbol=symbol).first()
    if exist_watchlist:
        return jsonify({"error": "Ký hiệu đã tồn tại", 'status': '401'})

    if exist_watchlist is None:
        new_watchList = WatchList(
            symbol=symbol
        )
        db.session.add(new_watchList)
        db.session.commit()
        exist_watchlist = new_watchList
        update_data_stock()

    return jsonify({'message': 'Thêm hoặc cập nhật mã cổ phiếu quan sát thành công', 'status': '200'})


@app.route("/get_all_watch_list", methods=["GET"])
def getAllWatchList():
    symbols = WatchList.query.all()
    data = []
    for symbol in symbols:
        data.append(symbol.symbol)
    return data


@app.route("/get_detail_stock_watch_list", methods=["POST"])
def getDetailStockFromWatchList():
    symbol = request.json["symbol"]

    stock_data = Stock.query.filter_by(symbol=symbol).first()
    if stock_data:
        stock_values = [
            {
                'datetime': value.datetime,
                'open': value.open,
                'high': value.high,
                'low': value.low,
                'close': value.close,
                'volume': value.volume,
            } for value in stock_data.values
        ]

        formatted_data = {
            'stock_id': stock_data.id,
            'symbol': stock_data.symbol,
            'interval': stock_data.interval,
            'currency': stock_data.currency,
            'exchange_timezone': stock_data.exchange_timezone,
            'exchange': stock_data.exchange,
            'mic_code': stock_data.mic_code,
            'type': stock_data.type,
            'values': stock_values,
        }

        return jsonify({'data': formatted_data})
    else:
        return jsonify({'error': 'Symbol not found'})


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


# Configure the OAuth instances
mail = Mail(app)

# To control caching so as to save and retrieve plot figs on client side


@app.after_request
def add_header(response):
    response.headers['Pragma'] = 'no-cache'
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Expires'] = '0'
    return response


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


@app.route('/stockDataDetail', methods=['POST'])
def stocDetail():
    symbol = request.json['symbol']
    interval = request.json['interval']
    outputsize = request.json['outputsize']

    url = "https://twelve-data1.p.rapidapi.com/time_series"

    querystring = {"symbol": {symbol}, "interval": {interval},
                   "outputsize": {outputsize}, "format": "json"}

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

    # ************* ARIMA SECTION ********************

    def ARIMA_ALGO(df):
        uniqueVals = df["Code"].unique()
        len(uniqueVals)
        df = df.set_index("Code")

        def arima_model(train, test):
            print("=============train================")
            print(train)
            print("=============train================")
            print("=============test================")
            print(test)
            print("=============test================")
            history = [x for x in train]
            predictions = list()
            for t in range(len(test)):
                # model = ARIMA(history, order=(6, 1, 0)).fit()
                model = auto_arima(history, suppress_warnings=True)
                output = model.predict(n_periods=1)
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
            plt.savefig('static/ARIMA1.png')
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
        regressor.fit(X_train, y_train, epochs=150, batch_size=32)

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
        print('tetsttttttttttt')
        loaded_model = pickle.load(
            open('C:/Users/lamph/Desktop/datn_ron_stock_prediction/trained_model.sav', 'rb'))
        vectorizer = TfidfVectorizer()
        twitter_data = pd.read_csv(
            'C:/Users/lamph/Desktop/datn_ron_stock_prediction/sentimentModel/processed_twitter_data.csv', encoding='ISO-8859-1')
        X = twitter_data['stemmed_content'].fillna('').values
        Y = twitter_data['target'].fillna('').values
        X_train, X_test, Y_train, Y_test = train_test_split(
            X, Y, test_size=0.2, stratify=Y, random_state=2)

        vectorizer = TfidfVectorizer()
        X_train = vectorizer.fit_transform(X_train)
        news_api_url = f'https://newsapi.org/v2/everything?q={symbol}&language=en&apiKey={api_key}'
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
                    for article in news_data['articles']:
                        news_text = article['title']
                        new = [news_text]
                        new_data_tfidf = vectorizer.transform(new)
                        analysis = loaded_model.predict(new_data_tfidf)
                        polarity = analysis[0]
                        if polarity > 0:
                            sentiment = "Positive"
                            pos += 1
                            global_polarity = global_polarity + 1
                        elif polarity == 0:
                            sentiment = "Negative"
                            neg += 1
                            global_polarity = global_polarity - 1
                        # else:
                        #     sentiment = "Neutral"
                        #     neutral += 1

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
                    sentiment_data = pd.DataFrame(
                        {'Sentiment': ['Positive', 'Negative'], 'Count': [pos, neg]})
                    plt.figure(figsize=(4.9, 4.9))
                    plt.pie(
                        sentiment_data['Count'], labels=sentiment_data['Sentiment'], autopct='%1.1f%%', startangle=100)
                    # Equal aspect ratio ensures that pie is drawn as a circle.
                    plt.axis('equal')
                    # Save the figure as 'static/SA.png'
                    plt.savefig('static/SA.png')
                    # Close the figure
                    plt.close()

                    return global_polarity, news_list, overall_sentiment, pos, neg
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
        print('================================')
        print(df)
        print('================================')


        arima_pred, error_arima, Quantity_date = ARIMA_ALGO(df)
        lstm_pred, error_lstm = LSTM_ALGO(df)
        df, lr_pred, forecast_set, mean, error_lr = LIN_REG_ALGO(df)

        # Assuming you have an 'api_key' variable defined with your API key
        api_key = '15a2cd458fe340a78d812cc5b50ef6bf'
        # symbol = quote

        # Call the retrieve_news_sentiment function with the 'api_key' argument
        polarity, news_list, overall_sentiment, pos, neg = retrieve_news_sentiment(
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
            "quantityDate": quantity_date_objects,
            "pos": pos,
            "nag": neg
        })


# @app.route('/api/add_stock', methods=['POST'])
def update_data_stock():
    # symbol = request.json['symbol']
    with app.app_context():
        print("-------------------------------------")
        print("start to update data stock in 10s")
        print("-------------------------------------")
        symbols = WatchList.query.all()
        for watch_list_symbols in symbols:
            symbol = watch_list_symbols.symbol
            # Kiểm tra xem stock với symbol đã tồn tại hay chưa
            existing_stock = Stock.query.filter_by(symbol=symbol).first()

            if existing_stock:
                # Nếu đã tồn tại, xóa tất cả các giá trị hiện tại của nó
                StockValue.query.filter_by(stock_id=existing_stock.id).delete()

            url = "https://twelve-data1.p.rapidapi.com/time_series"

            querystring = {"symbol": {symbol}, "interval": "1day",
                           "outputsize": "300", "format": "json"}

            headers = {
                "X-RapidAPI-Key": "b5d4927c0emsh1f0acff2027d55cp1d7c9ajsn4bb2a0645707",
                "X-RapidAPI-Host": "twelve-data1.p.rapidapi.com"
            }

            response = requests.get(url, headers=headers, params=querystring)

            if response.status_code != 200:
                return jsonify({'error': 'Failed to retrieve data from external API'}), 500

            data = response.json()

            if existing_stock:
                # Cập nhật thông tin của stock đã tồn tại
                existing_stock.interval = data['meta']['interval']
                existing_stock.currency = data['meta']['currency']
                existing_stock.exchange_timezone = data['meta']['exchange_timezone']
                existing_stock.exchange = data['meta']['exchange']
                existing_stock.mic_code = data['meta']['mic_code']
                existing_stock.type = data['meta']['type']
            else:
                # Nếu chưa tồn tại, thêm stock mới vào cơ sở dữ liệu
                new_stock = Stock(
                    symbol=data['meta']['symbol'],
                    interval=data['meta']['interval'],
                    currency=data['meta']['currency'],
                    exchange_timezone=data['meta']['exchange_timezone'],
                    exchange=data['meta']['exchange'],
                    mic_code=data['meta']['mic_code'],
                    type=data['meta']['type']
                )
                db.session.add(new_stock)
                db.session.commit()  # Commit phiên làm việc để lấy ID
                existing_stock = new_stock  # Để sử dụng cho việc thêm giá trị mới

            for value in data['values']:
                new_value = StockValue(
                    stock_id=existing_stock.id,
                    datetime=value['datetime'],
                    open=float(value['open']),
                    high=float(value['high']),
                    low=float(value['low']),
                    close=float(value['close']),
                    volume=int(value['volume'])
                )
                db.session.add(new_value)

            db.session.commit()

        print("-------------------------------------")
        print("End")
        print("-------------------------------------")

        return jsonify({'message': 'Stock added or updated successfully'})


@app.route('/get_stock_detail_from_database', methods=['POST'])
def get_stock_detail_from_database():
    symbol = request.json["symbol"]

    stock_info = Stock.query.filter_by(symbol=symbol).first()
    if not stock_info:
        return jsonify({'error': 'Không tìm thấy mã cổ phiếu'}), 404

    # Tìm kiếm các giá trị của cổ phiếu dựa trên ID
    stock_values = StockValue.query.filter_by(stock_id=stock_info.id).all()

    # Chuyển đổi kết quả thành định dạng dễ đọc hoặc trả về JSON
    result = {
        'symbol': stock_info.symbol,
        'interval': stock_info.interval,
        'currency': stock_info.currency,
        'exchange_timezone': stock_info.exchange_timezone,
        'exchange': stock_info.exchange,
        'mic_code': stock_info.mic_code,
        'type': stock_info.type,
        'values': []
    }

    for value in stock_values:
        result['values'].append({
            'datetime': value.datetime,
            'open': value.open,
            'high': value.high,
            'low': value.low,
            'close': value.close,
            'volume': value.volume
        })

    return jsonify(result)

@app.route('/sentiment_combine_1', methods=['POST'])
def sentimentCombineMain():
    df = pd.read_csv('C:/Users/lamph/Desktop/datn_ron_stock_prediction/sentimentModel/dataset/Final_nflx_data_2018-2022.csv')
    df['date'] = pd.to_datetime(df['date'])

    plt.figure(figsize=(18, 6), dpi=65)
    sns.lineplot(x=df["date"],y=df["Adj Close"])
    df['sentiment_analysis']=df['P_mean']
    df['sentiment_analysis']=df['sentiment_analysis'].apply(lambda x: 'pos' if x>0 else 'nue' if x==0 else 'neg')
    sns.scatterplot(x=df["date"],y=df['Adj Close'],hue=df['sentiment_analysis'],palette=['y','r','g'])
    plt.xticks(rotation=45)
    plt.title("Stock market of Netfilx from Jan-2018 to Jul-2022",fontsize=16)
    plt.savefig(
        'C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/sentimentCombineImage/netflix_stock_analysis_show_point.png')
    cols = [
        'Open',
        'High', 'Low',
        'Close',
        'Volume',
        'Adj Close',
        'P_mean',
            ]
    #Date and volume columns are not used in training.
    print(cols)

    #New dataframe with only training data - 5 columns
    df_for_training = df[cols].astype(float)
    df_for_training.index=df['date']

    scaler = MinMaxScaler()
    scaler = scaler.fit(df_for_training)
    df_for_training_scaled = scaler.transform(df_for_training)

    scaler_for_inference = MinMaxScaler()
    scaler_for_inference.fit_transform(df_for_training.loc[:,['Open','Adj Close']])

    #Empty lists to be populated using formatted training data
    trainX = []
    trainY = []

    n_future = 1   # Number of days we want to look into the future based on the past days.
    n_past = 5  # Number of past days we want to use to predict the future.

    #Reformat input data into a shape: (n_samples x timesteps x n_features)
    #In my example, my df_for_training_scaled has a shape (12823, 5)
    #12823 refers to the number of data points and 5 refers to the columns (multi-variables).
    for i in range(n_past, len(df_for_training_scaled) - n_future +1):
        trainX.append(df_for_training_scaled[i - n_past:i, 0:df_for_training.shape[1]])
        trainY.append(df_for_training_scaled[i + n_future - 1:i + n_future,[0,-2]])

    trainX, trainY = np.array(trainX), np.array(trainY)


    X_train_lstm_without_twitter, X_test_lstm_without_twitter, y_train_lstm_without_twitter, y_test_lstm_without_twitter = train_test_split(trainX[:,:,:-1], trainY, test_size=0.2, shuffle=False)
    X_train_lstm_twitter, X_test_lstm_twitter, y_train_lstm_twitter, y_test_lstm_twitter = train_test_split(trainX, trainY, test_size=0.2, shuffle=False)
    X_train_lstm_without_twitter.shape,X_train_lstm_twitter.shape

    X_train_lstm_without_twitter, X_val_lstm_without_twitter, y_train_lstm_without_twitter, y_val_lstm_without_twitter = train_test_split(X_train_lstm_without_twitter, y_train_lstm_without_twitter, test_size=0.2, shuffle=False)
    X_train_lstm_twitter, X_val_lstm_twitter, y_train_lstm_twitter, y_val_lstm_twitter = train_test_split(X_train_lstm_twitter, y_train_lstm_twitter, test_size=0.2, shuffle=False)
    X_train_lstm_without_twitter.shape,X_train_lstm_twitter.shape


    def build_model(input_shape):
        print('=======================')
        print(input_shape)
        print('=======================')
        tf.random.set_seed(seed)
        cnn_lstm_model = Sequential()

        cnn_lstm_model.add(Conv1D(filters=256, kernel_size=2, strides=1, padding='valid', input_shape=input_shape))
        cnn_lstm_model.add(MaxPooling1D(pool_size=2, strides=2))

        cnn_lstm_model.add(Conv1D(filters=128, kernel_size=2, strides=1, padding='valid'))
        cnn_lstm_model.add(MaxPooling1D(pool_size=1, strides=2))

        cnn_lstm_model.add(Bidirectional(LSTM(512, return_sequences=True)))
        cnn_lstm_model.add(Dropout(0.3))
        cnn_lstm_model.add(Bidirectional(LSTM(512, return_sequences=True)))
        cnn_lstm_model.add(Dropout(0.3))

        cnn_lstm_model.add(Dense(16, activation='relu'))
        cnn_lstm_model.add(Flatten())
        cnn_lstm_model.add(Dense(2, activation='linear'))  # Use linear activation for regression

        # Reshape the output to have the desired shape (None, 1, 2)
        cnn_lstm_model.add(Reshape((1, 2)))

        cnn_lstm_model.compile(optimizer='adam', loss='mse', metrics=['acc'])  # Use mean absolute error (mae) for regression
        cnn_lstm_model.summary()
        return cnn_lstm_model

    # fit the model

    cnn_lstm_model_without_twitter=build_model((X_train_lstm_without_twitter.shape[1],X_train_lstm_without_twitter.shape[2]))
    cnn_lstm_model_twitter=build_model((X_train_lstm_twitter.shape[1],X_train_lstm_twitter.shape[2]))
    history_without_twitter = cnn_lstm_model_without_twitter.fit(X_train_lstm_without_twitter, y_train_lstm_without_twitter, epochs=200, batch_size=64, validation_data=(X_val_lstm_without_twitter, y_val_lstm_without_twitter), verbose=1)
    history_twitter = cnn_lstm_model_twitter.fit(X_train_lstm_twitter, y_train_lstm_twitter, epochs=200, batch_size=64, validation_data=(X_val_lstm_twitter, y_val_lstm_twitter), verbose=1)
    loss_without_twitter_1, accuracy_without_twitter_1 = cnn_lstm_model_without_twitter.evaluate(X_test_lstm_without_twitter, y_test_lstm_without_twitter)
    loss_twitter_1, accuracy_twitter_1 = cnn_lstm_model_twitter.evaluate(X_test_lstm_twitter, y_test_lstm_twitter)


    plt.figure(figsize=(20, 7))
    plt.plot(history_without_twitter.history['loss'], label='Training loss')
    plt.plot(history_without_twitter.history['val_loss'], label='Validation loss')
    plt.title('Training loss Vs. Validation loss without twitter sentiment analysis')
    plt.savefig('C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/sentimentCombineImage/Training_loss_Vs_Validation_loss_without_twitter_sentiment_analysis.png')
    plt.legend()

    plt.figure(figsize=(20, 7))
    plt.plot(history_twitter.history['loss'], label='Training loss')
    plt.plot(history_twitter.history['val_loss'], label='Validation loss')
    plt.title('Training loss Vs. Validation loss including twitter sentiment analysis')
    plt.savefig('C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/sentimentCombineImage/Training_loss_Vs_Validation_loss_including_twitter_sentiment_analysis.png')
    plt.legend()

    def plot_predictions_with_dates(type, twitter, dates, y_actual_lstm, y_pred_lstm):
        predicted_features = ['Open', 'Adj Close']
        for i, predicted_feature in enumerate(predicted_features):
            plt.figure(figsize=(15, 6))
            if twitter:
                plt.title(f'LSTM {type} prediction of {predicted_feature} feature After adding twitter sentiment analysis')
            else:
                plt.title(f'LSTM {type} prediction of {predicted_feature} feature without twitter sentiment analysis')

            sns.lineplot(x=dates, y=y_actual_lstm[:, i], label='Actual')
            sns.lineplot(x=dates, y=y_pred_lstm[:, i], label='Predicted')

            # Lưu hình ảnh sau khi đã vẽ biểu đồ
            if twitter:
                plt.savefig(
                    f'C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/sentimentCombineImage/LSTM_{type}_of_{predicted_feature}_feature_After_adding_twitter_sentiment_analysis.png')
            else:
                plt.savefig(
                    f'C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/sentimentCombineImage/LSTM_{type}_of_{predicted_feature}_feature_without_twitter_sentiment_analysis.png')

            # Hiển thị biểu đồ
            plt.show()

            error = mean_squared_error(y_actual_lstm[:, i], y_pred_lstm[:, i])
            print(f'Mean square error for {predicted_feature} = {error}')

        print('Total mean square error', mean_squared_error(y_actual_lstm, y_pred_lstm))


    training_dates= df_for_training.index[:X_train_lstm_without_twitter.shape[0]]
    #Make prediction
    training_prediction_without_twitter = cnn_lstm_model_without_twitter.predict(X_train_lstm_without_twitter)
    training_prediction_twitter = cnn_lstm_model_twitter.predict(X_train_lstm_twitter)
    training_prediction_without_twitter=training_prediction_without_twitter.reshape(training_prediction_without_twitter.shape[0], training_prediction_without_twitter.shape[2])
    training_prediction_twitter=training_prediction_twitter.reshape(training_prediction_twitter.shape[0], training_prediction_twitter.shape[2])
    y_train_pred_lstm_without_twitter = scaler_for_inference.inverse_transform(training_prediction_without_twitter)
    y_train_pred_lstm_twitter = scaler_for_inference.inverse_transform(training_prediction_twitter)
    y_train_lstm_reshaped_without_twitter=y_train_lstm_without_twitter.reshape(y_train_lstm_without_twitter.shape[0], y_train_lstm_without_twitter.shape[2])
    y_train_actual_lstm = scaler_for_inference.inverse_transform(y_train_lstm_reshaped_without_twitter)

    plot_predictions_with_dates('Training',False,training_dates,y_train_actual_lstm,y_train_pred_lstm_without_twitter)
    plot_predictions_with_dates('Training',True,training_dates,y_train_actual_lstm,y_train_pred_lstm_twitter)
    validation_dates= df_for_training.index[X_train_lstm_without_twitter.shape[0]:X_train_lstm_without_twitter.shape[0] + X_val_lstm_without_twitter.shape[0]]
    #Make prediction
    validation_prediction_without_twitter = cnn_lstm_model_without_twitter.predict(X_val_lstm_without_twitter)
    validation_prediction_twitter = cnn_lstm_model_twitter.predict(X_val_lstm_twitter)
    validation_prediction_without_twitter=validation_prediction_without_twitter.reshape(validation_prediction_without_twitter.shape[0], validation_prediction_without_twitter.shape[2])
    validation_prediction_twitter=validation_prediction_twitter.reshape(validation_prediction_twitter.shape[0], validation_prediction_twitter.shape[2])
    y_val_pred_lstm_without_twitter = scaler_for_inference.inverse_transform(validation_prediction_without_twitter)
    y_val_pred_lstm_twitter = scaler_for_inference.inverse_transform(validation_prediction_twitter)
    y_val_actual_lstm_reshaped_without_twitter=y_val_lstm_without_twitter.reshape(y_val_lstm_without_twitter.shape[0], y_val_lstm_without_twitter.shape[2])
    y_val_actual_lstm = scaler_for_inference.inverse_transform(y_val_actual_lstm_reshaped_without_twitter)

    plot_predictions_with_dates('Validation',False,validation_dates,y_val_actual_lstm,y_val_pred_lstm_without_twitter)
    plot_predictions_with_dates('Validation',True,validation_dates,y_val_actual_lstm,y_val_pred_lstm_twitter)

    testing_dates= df_for_training.index[-X_test_lstm_without_twitter.shape[0]:]
    #Make prediction
    testing_prediction_without_twitter = cnn_lstm_model_without_twitter.predict(X_test_lstm_without_twitter)
    testing_prediction_twitter = cnn_lstm_model_twitter.predict(X_test_lstm_twitter)
    testing_prediction_without_twitter=testing_prediction_without_twitter.reshape(testing_prediction_without_twitter.shape[0], testing_prediction_without_twitter.shape[2])
    testing_prediction_twitter=testing_prediction_twitter.reshape(testing_prediction_twitter.shape[0], testing_prediction_twitter.shape[2])
    y_test_pred_lstm_without_twitter = scaler_for_inference.inverse_transform(testing_prediction_without_twitter)
    y_test_pred_lstm_twitter = scaler_for_inference.inverse_transform(testing_prediction_twitter)
    y_test_actual_lstm_reshaped_without_twitter=y_test_lstm_without_twitter.reshape(y_test_lstm_without_twitter.shape[0], y_test_lstm_without_twitter.shape[2])
    y_test_actual_lstm = scaler_for_inference.inverse_transform(y_test_actual_lstm_reshaped_without_twitter)

    plot_predictions_with_dates('Testing',False,testing_dates,y_test_actual_lstm,y_test_pred_lstm_without_twitter)
    plot_predictions_with_dates('Testing',True,testing_dates,y_test_actual_lstm,y_test_pred_lstm_twitter)

    features= ['Open','High', 'Low','Close','Volume','Adj Close','P_mean']
    df_for_training.iloc[-n_past:,:].to_numpy().reshape(1,n_past,len(features)).shape

    x_forcast=df_for_training.iloc[-n_past-3:-3,:] ## sự đoán cho 3 ngày cần dữ liệu 5 ngày
    x_forcast=scaler.transform(x_forcast).reshape(1,n_past,len(features))
    prediction = cnn_lstm_model_twitter.predict(x_forcast) #shape = (n, 1) where n is the n_days_for_prediction
    print(prediction.shape)
    prediction=prediction.reshape(prediction.shape[0],prediction.shape[2])
    #Perform inverse transformation to rescale back to original range

    # prediction = prediction.reshape(3,2)
    prediction=scaler_for_inference.inverse_transform(prediction)

    # Convert timestamp to dat

    print(prediction)

    result = {
        'loss_twitter_1': loss_twitter_1,
        'loss_without_twitter_1': loss_without_twitter_1,
        'accuracy_twitter_1': accuracy_twitter_1,
        'accuracy_without_twitter_1': accuracy_without_twitter_1
    }

    return jsonify(result)

@app.route('/sentiment_combine_3', methods=['POST'])
def sentimentCombineMain3():
    df = pd.read_csv('C:/Users/lamph/Desktop/datn_ron_stock_prediction/sentimentModel/dataset/Final_nflx_data_2018-2022.csv')
    df['date'] = pd.to_datetime(df['date'])
    plt.figure(figsize=(13, 6), dpi=65)
    sns.lineplot(x=df["date"],y=df["Adj Close"])
    df['sentiment_analysis']=df['P_mean']
    df['sentiment_analysis']=df['sentiment_analysis'].apply(lambda x: 'pos' if x>0 else 'nue' if x==0 else 'neg')
    sns.scatterplot(x=df["date"],y=df['Adj Close'],hue=df['sentiment_analysis'],palette=['y','r','g'])
    plt.xticks(rotation=45)
    plt.title("Stock market of Netfilx from Jan-2018 to Jul-2022",fontsize=16)
    plt.savefig(
        'C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/three_days/sentimentCombineImage/netflix_stock_analysis_show_point.png')
    cols = [
        'Open',
        'High', 'Low',
        'Close',
        'Volume',
        'Adj Close',
        'P_mean',
            ]
    #Date and volume columns are not used in training.
    print(cols)

    #New dataframe with only training data - 5 columns
    df_for_training = df[cols].astype(float)
    df_for_training.index=df['date']

    scaler = MinMaxScaler()
    scaler = scaler.fit(df_for_training)
    df_for_training_scaled = scaler.transform(df_for_training)

    scaler_for_inference = MinMaxScaler()
    scaler_for_inference.fit_transform(df_for_training.loc[:,['Open','Adj Close']])

     #Empty lists to be populated using formatted training data
    trainX = []
    trainY = []
    print(len(df_for_training_scaled))

    n_future = 3   # Number of days we want to look into the future based on the past days. ###
    n_past = 10  # Number of past days we want to use to predict the future.

    #Reformat input data into a shape: (n_samples x timesteps x n_features)
    #In my example, my df_for_training_scaled has a shape (12823, 5)
    #12823 refers to the number of data points and 5 refers to the columns (multi-variables).
    for i in range(n_past, len(df_for_training_scaled) - n_future +1):
        trainX.append(df_for_training_scaled[i - n_past:i, 0:df_for_training.shape[1]])
        trainY.append(df_for_training_scaled[i:i + n_future,[0,-2]]) ###

    trainX, trainY = np.array(trainX), np.array(trainY)
    # trainY = trainY.reshape(trainY.shape[0], -1, trainY.shape[1]*trainY.shape[2])### vecto đầu ra là 1-6 vì thế cần resshape tập train về 1 - 6

    print('train X: ', trainX)
    print('train Y: ', trainY)
    print('TrainX shape = {}.'.format(trainX.shape)) # (1116 - sample, 5 - time stamp , 7 - feature)
    print('TrainY shape = {}.'.format(trainY.shape)) # (1116 - sample, 1 - time stamp , 6 - feature)


    X_train_lstm_without_twitter, X_test_lstm_without_twitter, y_train_lstm_without_twitter, y_test_lstm_without_twitter = train_test_split(trainX[:,:,:-1], trainY, test_size=0.2, shuffle=False)

    X_train_lstm_twitter, X_test_lstm_twitter, y_train_lstm_twitter, y_test_lstm_twitter = train_test_split(trainX, trainY, test_size=0.2, shuffle=False)

    X_train_lstm_without_twitter, X_val_lstm_without_twitter, y_train_lstm_without_twitter, y_val_lstm_without_twitter = train_test_split(X_train_lstm_without_twitter, y_train_lstm_without_twitter, test_size=0.2, shuffle=False)

    X_train_lstm_twitter, X_val_lstm_twitter, y_train_lstm_twitter, y_val_lstm_twitter = train_test_split(X_train_lstm_twitter, y_train_lstm_twitter, test_size=0.2, shuffle=False)



    def build_model(input_shape):
        print('=======================')
        print(input_shape)
        print('=======================')
        tf.random.set_seed(seed)
        cnn_lstm_model = Sequential()

        cnn_lstm_model.add(Conv1D(filters=256, kernel_size=2, strides=1, padding='valid', input_shape=input_shape))
        cnn_lstm_model.add(MaxPooling1D(pool_size=2, strides=2))

        cnn_lstm_model.add(Conv1D(filters=128, kernel_size=2, strides=1, padding='valid'))
        cnn_lstm_model.add(MaxPooling1D(pool_size=1, strides=2))

        cnn_lstm_model.add(Bidirectional(LSTM(512, return_sequences=True)))
        cnn_lstm_model.add(Dropout(0.3))
        cnn_lstm_model.add(Bidirectional(LSTM(512, return_sequences=True)))
        cnn_lstm_model.add(Dropout(0.3))

        cnn_lstm_model.add(Dense(16, activation='relu'))
        cnn_lstm_model.add(Flatten())
        cnn_lstm_model.add(Dense(3 * 2, activation='linear'))  # Adjust units to 3 * 2

        # Reshape the output to have the desired shape (None, 3, 2)
        cnn_lstm_model.add(Reshape((3, 2)))

        cnn_lstm_model.compile(optimizer='adam', loss='mse', metrics=[keras.metrics.RootMeanSquaredError()])
        cnn_lstm_model.summary()
        return cnn_lstm_model

    # fit the model

    cnn_lstm_model_without_twitter=build_model((X_train_lstm_without_twitter.shape[1],X_train_lstm_without_twitter.shape[2]))
    cnn_lstm_model_twitter=build_model((X_train_lstm_twitter.shape[1],X_train_lstm_twitter.shape[2]))

    history_without_twitter = cnn_lstm_model_without_twitter.fit(X_train_lstm_without_twitter, y_train_lstm_without_twitter, epochs=200, batch_size=64, validation_data=(X_val_lstm_without_twitter, y_val_lstm_without_twitter), verbose=1, )
    loss_without_twitter_3, accuracy_without_twitter_3 = cnn_lstm_model_without_twitter.evaluate(X_test_lstm_without_twitter, y_test_lstm_without_twitter)
    history_twitter = cnn_lstm_model_twitter.fit(X_train_lstm_twitter, y_train_lstm_twitter, epochs=200, batch_size=64, validation_data=(X_val_lstm_twitter, y_val_lstm_twitter), verbose=1, )
    loss_twitter_3, accuracy_twitter_3 = cnn_lstm_model_twitter.evaluate(X_test_lstm_twitter, y_test_lstm_twitter)

    plt.figure(figsize=(13, 6), dpi=65)
    plt.plot(history_without_twitter.history['loss'], label='Training loss')
    plt.plot(history_without_twitter.history['val_loss'], label='Validation loss')
    plt.title('Training loss Vs. Validation loss without twitter sentiment analysis')
    plt.savefig('C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/three_days/sentimentCombineImage/Training_loss_Vs_Validation_loss_without_twitter_sentiment_analysis.png')
    plt.legend()

    plt.figure(figsize=(13, 6), dpi=65)
    plt.plot(history_twitter.history['loss'], label='Training loss')
    plt.plot(history_twitter.history['val_loss'], label='Validation loss')
    plt.title('Training loss Vs. Validation loss including twitter sentiment analysis')
    plt.savefig('C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/three_days/sentimentCombineImage/Training_loss_Vs_Validation_loss_including_twitter_sentiment_analysis.png')
    plt.legend()

    def plot_predictions_with_dates (type,twitter,dates,y_actual_lstm,y_pred_lstm):
        predicted_features=['Open','Adj Close']
        print('y_actual_lstm', y_actual_lstm)
        print('y_pred_lstm', y_pred_lstm)
        for i,predicted_feature in enumerate(predicted_features):
            # print('y_actual_lstm', y_actual_lstm)
            # print('y_pred_lstm', y_pred_lstm)
            plt.figure(figsize=(15,6))
            if twitter :
                plt.title(f'LSTM {type} prediction of {predicted_feature} feature After adding twitter sentiment analysis')
            else:
                plt.title(f'LSTM {type} prediction of {predicted_feature} feature without twitter sentiment analysis')
            sns.lineplot(x=dates, y=y_actual_lstm[:,0,i],label='Actual', color='green')
            sns.lineplot(x=dates, y=y_pred_lstm[:,0,i], label='Predicted 1 day', color='blue')
            sns.lineplot(x=dates, y=y_pred_lstm[:,1,i], label='Predicted 2 day', color='yellow')
            sns.lineplot(x=dates, y=y_pred_lstm[:,2,i], label='Predicted 3 day', color='pink')
            if twitter:
                plt.savefig(
                    f'C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/three_days/sentimentCombineImage/LSTM_{type}_of_{predicted_feature}_feature_After_adding_twitter_sentiment_analysis.png')
            else:
                plt.savefig(
                    f'C:/Users/lamph/Desktop/datn_ron_stock_prediction/static/three_days/sentimentCombineImage/LSTM_{type}_of_{predicted_feature}_feature_without_twitter_sentiment_analysis.png')
            plt.show()
            error=mean_squared_error(y_actual_lstm[:,i], y_pred_lstm[:, i])
            print(f'Mean square error for {predicted_feature} ={error}')
        print('Total mean square error', mean_squared_error(y_actual_lstm.reshape(-1,2), y_pred_lstm.reshape(-1,2)))

    training_dates= df_for_training.index[:X_train_lstm_without_twitter.shape[0]]
    #Make prediction
    training_prediction_without_twitter = cnn_lstm_model_without_twitter.predict(X_train_lstm_without_twitter)
    training_prediction_twitter = cnn_lstm_model_twitter.predict(X_train_lstm_twitter)

    print(training_prediction_without_twitter.shape)

    training_prediction_without_twitter=training_prediction_without_twitter.reshape(training_prediction_without_twitter.shape[0], training_prediction_without_twitter.shape[2]*training_prediction_without_twitter.shape[1])
    training_prediction_twitter=training_prediction_twitter.reshape(training_prediction_twitter.shape[0], training_prediction_twitter.shape[2]*training_prediction_twitter.shape[1])

    print('y_train_pred_lstm_without_twitter 1', training_prediction_without_twitter)
    reshaped_arrays = [arr.reshape(3, 2) for arr in training_prediction_without_twitter]
    training_prediction_without_twitter = np.concatenate(reshaped_arrays, axis=0)

    reshaped_arrays_add = [arr.reshape(3, 2) for arr in training_prediction_twitter]
    training_prediction_twitter = np.concatenate(reshaped_arrays_add, axis=0)

    y_train_pred_lstm_without_twitter = scaler_for_inference.inverse_transform(training_prediction_without_twitter)
    y_train_pred_lstm_twitter = scaler_for_inference.inverse_transform(training_prediction_twitter)

    y_train_lstm_reshaped_without_twitter=y_train_lstm_without_twitter.reshape(y_train_lstm_without_twitter.shape[0], y_train_lstm_without_twitter.shape[2]*y_train_lstm_without_twitter.shape[1])

    reshaped_arrays_y = [arr.reshape(3, 2) for arr in y_train_lstm_reshaped_without_twitter]
    # y_train_lstm_reshaped_without_twitter = np.concatenate(reshaped_arrays_add, axis=0)
    y_train_lstm_reshaped_without_twitter = np.concatenate(reshaped_arrays_y, axis=0)

    y_train_actual_lstm = scaler_for_inference.inverse_transform(y_train_lstm_reshaped_without_twitter)
    print(len(y_train_pred_lstm_without_twitter), 'fdf')
    print(len(y_train_actual_lstm), 'âs')
    y_train_pred_lstm_without_twitter = y_train_pred_lstm_without_twitter.reshape(y_train_pred_lstm_without_twitter.shape[0]//3, 3,2)
    y_train_actual_lstm = y_train_actual_lstm.reshape(y_train_actual_lstm.shape[0]//3, 3,2)
    y_train_pred_lstm_twitter = y_train_pred_lstm_twitter.reshape(y_train_pred_lstm_twitter.shape[0]//3, 3, 2)

    plot_predictions_with_dates('Training',False,training_dates,y_train_actual_lstm,y_train_pred_lstm_without_twitter)

    # print('before 1: ', y_train_actual_lstm)
    # print('before 2: ', y_train_pred_lstm_twitter)
    plot_predictions_with_dates('Training',True,training_dates,y_train_actual_lstm,y_train_pred_lstm_twitter)
    # mean_squared_error(y_train_actual_lstm[:,0], y_train_pred_lstm_twitter[:, 0])

    validation_dates= df_for_training.index[X_train_lstm_without_twitter.shape[0]:X_train_lstm_without_twitter.shape[0] + X_val_lstm_without_twitter.shape[0]]
    #Make prediction
    validation_prediction_without_twitter = cnn_lstm_model_without_twitter.predict(X_val_lstm_without_twitter)

    validation_prediction_twitter = cnn_lstm_model_twitter.predict(X_val_lstm_twitter)

    validation_prediction_without_twitter=validation_prediction_without_twitter.reshape(validation_prediction_without_twitter.shape[0], validation_prediction_without_twitter.shape[2]*validation_prediction_without_twitter.shape[1])


    validation_prediction_twitter=validation_prediction_twitter.reshape(validation_prediction_twitter.shape[0], validation_prediction_twitter.shape[2]*validation_prediction_twitter.shape[1])
    reshaped_arrays = [arr.reshape(3, 2) for arr in validation_prediction_without_twitter]
    validation_prediction_without_twitter = np.concatenate(reshaped_arrays, axis=0)

    reshaped_arrays_val = [arr.reshape(3, 2) for arr in validation_prediction_twitter]
    validation_prediction_twitter = np.concatenate(reshaped_arrays_val, axis=0)

    y_val_pred_lstm_without_twitter = scaler_for_inference.inverse_transform(validation_prediction_without_twitter)
    y_val_pred_lstm_twitter = scaler_for_inference.inverse_transform(validation_prediction_twitter)

    y_val_actual_lstm_reshaped_without_twitter=y_val_lstm_without_twitter.reshape(y_val_lstm_without_twitter.shape[0], y_val_lstm_without_twitter.shape[2]*y_val_lstm_without_twitter.shape[1])
    reshaped_arrays_val_actual = [arr.reshape(3, 2) for arr in y_val_actual_lstm_reshaped_without_twitter]
    y_val_actual_lstm_reshaped_without_twitter = np.concatenate(reshaped_arrays_val_actual, axis=0)
    y_val_actual_lstm = scaler_for_inference.inverse_transform(y_val_actual_lstm_reshaped_without_twitter)

    y_val_pred_lstm_without_twitter = y_val_pred_lstm_without_twitter.reshape(y_val_pred_lstm_without_twitter.shape[0]//3, 3,2)
    y_val_actual_lstm = y_val_actual_lstm.reshape(y_val_actual_lstm.shape[0]//3, 3,2)
    y_val_pred_lstm_twitter = y_val_pred_lstm_twitter.reshape(y_val_pred_lstm_twitter.shape[0]//3, 3, 2)

    plot_predictions_with_dates('Validation',False,validation_dates,y_val_actual_lstm,y_val_pred_lstm_without_twitter)

    plot_predictions_with_dates('Validation',True,validation_dates,y_val_actual_lstm,y_val_pred_lstm_twitter)

    testing_dates= df_for_training.index[-X_test_lstm_without_twitter.shape[0]:]
    #Make prediction
    testing_prediction_without_twitter = cnn_lstm_model_without_twitter.predict(X_test_lstm_without_twitter)
    testing_prediction_twitter = cnn_lstm_model_twitter.predict(X_test_lstm_twitter)

    testing_prediction_without_twitter=testing_prediction_without_twitter.reshape(testing_prediction_without_twitter.shape[0], testing_prediction_without_twitter.shape[2]*testing_prediction_without_twitter.shape[1])
    testing_prediction_twitter=testing_prediction_twitter.reshape(testing_prediction_twitter.shape[0], testing_prediction_twitter.shape[2]*testing_prediction_twitter.shape[1])

    reshaped_arrays_val = [arr.reshape(3, 2) for arr in testing_prediction_without_twitter]
    testing_prediction_without_twitter = np.concatenate(reshaped_arrays_val, axis=0)

    y_test_pred_lstm_without_twitter = scaler_for_inference.inverse_transform(testing_prediction_without_twitter)

    reshaped_arrays = [arr.reshape(3, 2) for arr in testing_prediction_twitter]
    testing_prediction_twitter = np.concatenate(reshaped_arrays, axis=0)

    y_test_pred_lstm_twitter = scaler_for_inference.inverse_transform(testing_prediction_twitter)

    y_test_actual_lstm_reshaped_without_twitter=y_test_lstm_without_twitter.reshape(y_test_lstm_without_twitter.shape[0], y_test_lstm_without_twitter.shape[2]*y_test_lstm_without_twitter.shape[1])

    reshaped_arrays_test = [arr.reshape(3, 2) for arr in y_test_actual_lstm_reshaped_without_twitter]
    y_test_actual_lstm_reshaped_without_twitter = np.concatenate(reshaped_arrays_test, axis=0)

    y_test_actual_lstm = scaler_for_inference.inverse_transform(y_test_actual_lstm_reshaped_without_twitter)

    y_test_pred_lstm_without_twitter = y_test_pred_lstm_without_twitter.reshape(y_test_pred_lstm_without_twitter.shape[0]//3, 3,2)
    y_test_actual_lstm = y_test_actual_lstm.reshape(y_test_actual_lstm.shape[0]//3, 3,2)
    y_test_pred_lstm_twitter = y_test_pred_lstm_twitter.reshape(y_test_pred_lstm_twitter.shape[0]//3, 3, 2)

    plot_predictions_with_dates('Testing',False,testing_dates,y_test_actual_lstm,y_test_pred_lstm_without_twitter)

    plot_predictions_with_dates('Testing',True,testing_dates,y_test_actual_lstm,y_test_pred_lstm_twitter)

    features= ['Open','High', 'Low','Close','Volume','Adj Close','P_mean']
    df_for_training.iloc[-n_past:,:].to_numpy().reshape(1,n_past,len(features)).shape
    x_forcast = df_for_training.iloc[-n_past-2:-2, :]
    x_forcast = scaler.transform(x_forcast).reshape(1, n_past, len(features))
    print(x_forcast)
    x_forcast=df_for_training.iloc[-n_past-3:-3,:] ## sự đoán cho 3 ngày cần dữ liệu 5 ngày
    print(x_forcast)
    x_forcast=scaler.transform(x_forcast).reshape(1,n_past,len(features))
    prediction = cnn_lstm_model_twitter.predict(x_forcast) #shape = (n, 1) where n is the n_days_for_prediction
    # prediction=prediction.reshape(prediction.shape[0],prediction.shape[2])
    #Perform inverse transformation to rescale back to original range
    print(prediction)
    prediction = prediction.reshape(3,2)
    prediction=scaler_for_inference.inverse_transform(prediction)

    # Convert timestamp to date

    print(prediction)

    result = {
        'loss_twitter_3': loss_twitter_3,
        'loss_without_twitter_3': loss_without_twitter_3,
        'accuracy_twitter_3': accuracy_twitter_3,
        'accuracy_without_twitter_3': accuracy_without_twitter_3
    }
    return jsonify(result)

if __name__ == '__main__':
    sched.add_job(id='update_data_stock', func=update_data_stock,
                  trigger='interval', hours=24)
    sched.start()
    app.run()
