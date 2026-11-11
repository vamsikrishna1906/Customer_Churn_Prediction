<div align="right">
  
[1]: https://github.com/praveengouda25
[2]: https://www.linkedin.com/in/praveen-kumar-bcc2525/

[![github](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/4f3921b8f8104e2a1fd9ff8dbf2191765a89e228/icons/git.svg)][1]
[![linkedin](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/7cdd63bd3820d6a3cc1d61d0a78f976d942c9ea6/icons/linkedin.svg)][2]

</div>


# <div align="center">Telecom Customer Churn Prediction</div>

![Customer Churn](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/d8e3eaadad0de3ce621e19518cf340705c1667ff/outputs/1_nyYWLxe8m8FOvvKw76__9w.jpg)  


## 📌 Introduction
Customer churn refers to when subscribers stop using a company’s services and switch to competitors.  
In the telecom industry, churn rates can be as high as **15–25% annually** due to intense competition.  

- Retaining existing customers is **more cost-effective** than acquiring new ones.  
- Machine Learning helps by **identifying at-risk customers early**, allowing targeted retention strategies.  
- This project uses ML models to predict churn and highlight factors influencing customer decisions.  

---

## 🚀 Run the interactive dashboard

The local dashboard provides customer and churn summaries, interactive contract/status filters, segment charts, customer search, and filtered CSV export. It reads the included dataset and runs without Python packages or external services.

1. Open PowerShell in the `Telecom_Customer_Churn_Prediction` folder.
2. Run `.\serve.ps1` (if script execution is restricted, use `powershell -ExecutionPolicy Bypass -File .\serve.ps1`).
3. Open [http://localhost:8765](http://localhost:8765) in a browser. Press **Ctrl+C** in PowerShell to stop the local server.

Choose **Load dataset** to use a different CSV. The dashboard requires `customerID`, `tenure`, `InternetService`, `Contract`, `MonthlyCharges`, and `Churn` columns. Analysis stays in the browser; it reports observed dataset patterns and does not claim to make individual churn predictions.

---

## 🎯 Objectives
- Calculate the **% of churn vs retained customers**.  
- Analyze **key drivers** responsible for churn.  
- Train ML models to classify **churn vs non-churn customers**.  
- Recommend the **best-performing model** for real-world deployment.  

---

## 📂 Dataset
We used the [Telco Customer Churn dataset](https://www.kaggle.com/bhartiprasad17/customer-churn-prediction/data).  

---
## 📊 Power BI Dashboard

Along with Machine Learning models, a **Power BI dashboard** was created to provide interactive insights into customer churn.  
This dashboard helps stakeholders **visualize churn drivers** and explore customer segments at risk.  

### 🔹 Key Features of the Dashboard:
- **Churn Rate Overview** – % of customers who left vs retained.  
- **Customer Demographics** – Breakdown by gender, senior citizen, dependents.  
- **Account & Services** – Contract type, billing methods, internet & security services.  
- **Revenue Impact** – Monthly charges vs churn behavior.  
- **Drill-Down Analysis** – Ability to filter customers based on churn risk.  

### 📷 Dashboard Preview
![Customer Churn Dashboard](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/075d2d7cb40c80bf9bec7c54a9db13f8e386afcd/icons/Risk%20Analysis%20Dashboard.png)

### 📂 Dashboard File
You can explore the interactive Power BI dashboard by downloading the `.pbix` file:  

👉 [Telecom_Customer_Churn_Dashboard.pbix](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/tree/018f1afef9b68861245dc6470fa8ef2ed55426a6/Power-BI%20Dashboard)  

---

**Features include:**  
- **Churn status** – Whether the customer left within the last month.  
- **Services** – Phone, internet, streaming, online security, tech support, etc.  
- **Account info** – Contract type, billing, monthly & total charges, tenure.  
- **Demographics** – Gender, senior citizen, dependents, partners.  

---

## 🛠️ Tech Stack
- **Programming:** Python  
- **Libraries:** Pandas, NumPy, Scikit-learn, Matplotlib, Seaborn  
- **Deployment:** Flask  
- **Visualization:** Matplotlib / Seaborn  

---

## 🔎 Workflow
1. **Data Preprocessing** – Handle missing values, encode categorical data, scale features.  
2. **EDA** – Analyze churn distribution & customer behavior.  
3. **Feature Engineering** – Extract meaningful variables.  
4. **Model Training** – Logistic Regression, Decision Tree, Random Forest, KNN, Naive Bayes, Ensemble methods.  
5. **Evaluation** – Accuracy, Precision, Recall, F1-score, ROC-AUC.  
6. **Deployment** – Flask app for churn prediction.  

---

## 📊 Exploratory Data Analysis (EDA)

### 1. Churn Distribution  
![Churn distribution](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/Churn%20Distribution.png)
> ~26% of customers switched providers.  

### 2. Churn vs Gender  
![Churn wrt Gender](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/distributionWRTGender.PNG)
> Both genders show similar churn behavior.  

### 3. Contract Types  
![Contract distribution](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/Contract%20distribution.png)  
> Customers with **Month-to-Month contracts** are most likely to churn.  

### 4. Payment Methods  
![Payment Methods](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/payment%20methods.png)  
![Payment wrt Churn](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/payment%20ethods%20with%20respectto%20churn.PNG)  
> Customers paying via **Electronic Check** churn more frequently.  

### 5. Internet Services  
![Internet Services](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/internet%20services.PNG)  
> Customers with **Fiber Optic** services show higher churn.  

### 6. Dependents  
![Dependents](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/dependents.PNG)  
> Customers **without dependents** churn more.  

### 7. Online Security  
![Online Security](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/onlineSecurity.PNG)  
> Lack of **online security services** increases churn risk.  

### 8. Senior Citizens  
![Senior Citizen](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/seniorCitzen.PNG)  
> Senior citizens have a higher churn rate.  

### 9. Billing  
![Billing](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/billing.PNG)  
> Customers with **Paperless Billing** are more likely to churn.  

### 10. Tech Support  
![Tech Support](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/techSupport.PNG)  
> Lack of **Tech Support** drives higher churn.  

### 11. Charges & Tenure  
![Monthly Charges](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/carges%20distribution.PNG)
![Total Charges](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/total%20charges.PNG)  
![Tenure](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/tenure%20and%20churn.PNG)  
> New customers and those with **high monthly charges** churn more.  

---

## 🤖 Machine Learning Models

### Models Implemented  
- Logistic Regression  
- KNN  
- Naive Bayes  
- Decision Tree  
- Random Forest  
- AdaBoost  
- Gradient Boost  
- Voting Classifier  

### Results after K-Fold Cross Validation  
![Model Evaluation](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/Model%20evaluation.PNG)  

> **Best Model:** Voting Classifier (~85% Accuracy).  



#### Results after K fold cross validation:

### 📊 Model Performance Visualizations  

![Linear Regression](https://github.com/praveengouda25/Telecom_Customer_Churn_Prediction/blob/main/outputs/LR.PNG)

![KNN](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/KNN.PNG?raw=true)  

![Naive Bayes](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/Naive%20Bayes.PNG?raw=true)  

![Decision Tree](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/Decision%20trees.PNG?raw=true)  

![Random Forest](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/Random%20Forest.PNG?raw=true)
![Adaboost](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/Adaboost.PNG?raw=true)
![Gradient Boost](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/Gradient%20boost.PNG?raw=true)
![Voting Classifier](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/Voting%20Classifier.PNG?raw=true)

![Confusion Matrix](https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/confusion_matrix_models.PNG?raw=true)
#### Final Model: Voting Classifier
* We have selected Gradient boosting, Logistic Regression, and Adaboost for our Voting Classifier.
```
    from sklearn.ensemble import VotingClassifier
    clf1 = GradientBoostingClassifier()
    clf2 = LogisticRegression()
    clf3 = AdaBoostClassifier()
    eclf1 = VotingClassifier(estimators=[('gbc', clf1), ('lr', clf2), ('abc', clf3)], voting='soft')
    eclf1.fit(X_train, y_train)
    predictions = eclf1.predict(X_test)
    print("Final Accuracy Score ")
    print(accuracy_score(y_test, predictions))
```
```
Final Score 
{'LogisticRegression': [0.841331397558646, 0.010495252078550477],
 'KNeighborsClassifier': [0.7913242024807321, 0.008198993337848612],
 'GaussianNB': [0.8232386881685605, 0.00741678015498337],
 'DecisionTreeClassifier': [0.6470213137060805, 0.02196953973039052],
 'RandomForestClassifier': [0.8197874155380965, 0.011556155864106703],
 'AdaBoostClassifier': [0.8445838813774079, 0.01125665302188384],
 'GradientBoostingClassifier': [0.844630629931458, 0.010723107447558198],
 'VotingClassifier': [0.8468096379573085, 0.010887508320460332]}

```
* Final confusion matrix we got:
<img src= "https://github.com/Pradnya1208/Telecom-Customer-Churn-prediction/blob/main/output/confusion%20matrix.PNG?raw=true" width = "425" />

>From the confusion matrix we can see that: There are total 1383+166=1549 actual non-churn values and the algorithm predicts 1400 of them as non churn and 149 of them as churn. While there are 280+280=561 actual churn values and the algorithm predicts 280 of them as non churn values and 281 of them as churn values.

## Conclusion :
:
This project demonstrates how Machine Learning can be applied to predict customer churn in the telecom industry. By analyzing customer demographics, service usage, contract types, and billing methods, we built several classification models to identify customers at risk of leaving.

The Voting Classifier (combining Gradient Boosting, Logistic Regression, and AdaBoost) achieved the highest accuracy of ~85%, outperforming individual models.

Key factors influencing churn include:

Month-to-Month contracts – customers are less committed and more likely to leave.

Electronic check payments – strongly associated with higher churn.

High monthly charges & shorter tenure – lead to dissatisfaction.

Lack of online security, tech support, or dependents – increases churn risk.

## Business Impact:
Accurate churn prediction enables telecom providers to:

Design targeted retention strategies (loyalty benefits, discounts, personalized offers).

Improve customer satisfaction by addressing the key pain points.

Reduce churn rates, ultimately saving millions in revenue.


