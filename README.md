## Data Visualization Project - Coronavirus Interactive Map

The link of our website can be found here : https://rlaraki.github.io

### Tools
- D3.js v5
- Bootstrap v4
- topojson.js v3

### User Guide

The website is composed of a 4-buttons menu. From the choice of the selected button, a corresponding map is shown with more precise data in the right scroll view. 

The table below summarizes the functionnalities of theses buttons.

|Button|Description|
|---|---|
| Cases|The map for cases shows the cumulative number of cases per region, which are represented by the red circles. A slider on the top of map allows the user to visualise how the number of cases per region evolves by the time. The user can select a country to visualize a line plot of the evolution of the number of cases and a sankey diagram that shows the ratio of women/men that are alive/dead. For each additional selected country, a new line in the line plot is drawn and an additional sankey diagram is shown. Some lines or sankey diagram may not be shown due to the missing data for some countries.|
|Deaths|The map for cases shows the cumulative number of deaths per region, which are represented by the black circles. A slider on the top of map allows the user to visualise how the number of deaths per region evolves by the time. The user can select a country to visualize a line plot of the evolution of the number of deaths and a sankey diagram that shows the ratio of women/men that are alive/dead. For each additional selected country, a new line in the line plot is drawn and an additional sankey diagram is shown. Some lines or sankey diagram may not be shown due to the missing data for some countries.|
|Recovered|The map for cases shows the cumulative number of recovers per region, which are represented by the green circles. A slider on the top of map allows the user to visualise how the number of recovers per region evolves by the time. The user can select a country to visualize a line plot of the evolution of the number of recovers. For each additional selected country, a new line in the line plot is drawn. Some lines may not be shown due to the missing data for some countries.|
|Measures|The choropleth map for measures shows the stringency index by country over the time. The stringency index is a government measure tracker based on policy indicators such as school closures or movement restriction, record economic policy such as income support to citizens or provision of foreign and finally record health system policies such as the COVID-19 testing regime or emergency investments into healthcare. A slider on the top of the map allows the user to visualise the evolution of the strigency index over the time. The user can select a country to visualize a line plot of the number of contamination cases with little circles that represent a decision making by the government and also a line plot representing the cumulative number of tests done on the country's habitants. Some lines may not be shown due to the missing data for some countries.|



### Authors

- Rayane Laraki
- Stanislas Michel Jouven
- Olivier Quôc-Vinh Lam
