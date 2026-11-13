# ui-lab

Automated UI tests for ITCS386, Software Verification and Validation. Test case QP-01 (a custom pizza reaches the admin list) is automated on QuickPizza (https://quickpizza.grafana.com) with two tools, and the web form of Selenium (https://www.selenium.dev/selenium/web/web-form.html) is tested as a warm-up.

Tool parts that I chose: **Part 3, Robot Framework** and **Part 4, Cypress**.

`RESULTS.md` holds the answers, the results of the runs and the reflection.

## robot/ (Part 3)

Robot Framework tests with SeleniumLibrary. `pizza_scenario.robot` is QP-01, `resources/quickpizza.resource` holds the locators and keywords of the QuickPizza pages, `first.robot` and `web_form.robot` test the web form, and `results/run1` and `results/run2` are the report, log and screenshots of two full runs.

Needs Python 3.10 or newer and the environment variable `CHROMEDRIVER` set to the path of a ChromeDriver that matches Chrome (Part 0 of the lab). Set up once with `python -m venv .venv`, activate it, and `pip install -r requirements.txt`. Run the tests from the `robot` folder with:

```
robot -d results/run1 -v BROWSER:headlesschrome pizza_scenario.robot
```

## cypress/ (Part 4)

Cypress tests. `cypress/e2e/pizza-scenario.cy.js` is QP-01, `cypress/e2e/web-form.cy.js` tests the web form, `cypress/support/commands.js` holds the custom command `adminLogin`, and `cypress/videos` and `cypress/screenshots` are the evidence of a full run.

Needs Node.js 22 or newer and Google Chrome. Run `npm install` once in the `cypress` folder (with npm 11.19 or newer, also `npm install-scripts approve cypress`). Run the tests from the `cypress` folder with:

```
npx cypress run --browser chrome
```

## Practice-site rules

Every pizza that a test creates is named `Lab Pizza` followed by the date and time of the run, so a run never collides with data from an earlier run. The tests never click Clear Ratings, and they log in only with the demo user of QuickPizza.
