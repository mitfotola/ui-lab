# UI lab results

Tool parts that I chose: Part 3 (Robot Framework) and Part 4 (Cypress)

## Part 0
- Step 0.1, Chrome version: Google Chrome 157.0.8103.51 (Official Build) (64-bit), Windows 11
- Step 0.3, ChromeDriver version: ChromeDriver 157.0.8103.51, the same as Chrome. Stored at C:\drivers\chromedriver-win64\chromedriver.exe and read from the environment variable CHROMEDRIVER.
- Step 0.4, locator of Pizza, Please!: `button[name="pizza-please"]` (Robot: `name:pizza-please`). `document.querySelectorAll('button[name="pizza-please"]').length` is 1.
- Step 0.4, locator of Excluded tools: `select` (Robot: `css:select`). It is the only list on the page, so it finds 1 element, with the options Knife, Pizza cutter and Scissors.
- Step 0.4, locator of Must be vegetarian: `#default-checkbox` (Robot: `id:default-checkbox`). It finds 1 element.
- Step 0.4, locator of Custom Pizza Name: `input#pizza-name`. `#pizza-name` alone matches the box and, after Pizza, Please!, the heading of the answer, so the tag name is needed. The box Max Calories per Slice is found through its label, because `$$("#floating_filled").length` is 3.
- Step 0.5, pizza name, tool and calories of the run by hand: Lab Pizza 20261113-163937, tool Scissors, 350 calories per slice

| Step | Actual result | Pass or fail |
|------|---------------|--------------|
| 1 | The heading read "Looking to break out of your pizza routine?" | Pass |
| 2 | After turning on Advanced, Max Calories per Slice (showing 1000), Excluded tools (Knife, Pizza cutter, Scissors), Must be vegetarian and Custom Pizza Name appeared. | Pass |
| 3 | Max Calories per Slice showed 600, Knife was selected, Must be vegetarian was ticked, and Custom Pizza Name showed Lab Pizza 20261113-163937. | Pass |
| 4 | The answer showed Name: Lab Pizza 20261113-163937, Tool: Scissors (not Knife) and Calories per slice: 350 (600 or fewer). It appeared about a second after the click. | Pass |
| 5 | Love it! without a login showed "Please log in first." | Pass |
| 6 | /admin showed both boxes filled with admin. After Sign in, the page showed "Latest pizza recommendations". | Pass |
| 7 | The list had the line "Lab Pizza 20261113-163937 (tool=Scissors, ingredients_number=5)". The tool Scissors is the same as in step 4. | Pass |

## Part 3: Robot Framework
- robot --version: Robot Framework 7.5.1 (Python 3.12.10 on win32)
- Step 3.2, failure message for the wrong title: `Title should have been 'Web Form' but was 'Web form'.`
- Step 3.8, run 1, result, elapsed time and pizza name: PASS, 17.8 s, Lab Pizza 20261113-163432 (tool Scissors, 425 calories)
- Step 3.8, run 2, result, elapsed time and pizza name: PASS, 11.6 s, Lab Pizza 20261113-163447

## Part 4: Cypress
- node --version, npm --version and npx cypress version: v22.23.1, 12.0.1, Cypress package version 16.2.1 and binary version 16.2.1
- Step 4.3, failure message for the wrong title: `Timed out retrying after 10000ms`, then `+ expected - actual`, `-'Web form'`, `+'Web Form'`
- Step 4.6, tool and calories in the answer of POST /api/pizza: run 1 Pizza cutter and 525, run 2 Pizza cutter and 400. The page showed the same values, and `request.body.maxCaloriesPerSlice` was 600.
- Step 4.7, the line of the admin list that shows your pizza: `Lab Pizza 20261113-163838 (tool=Pizza cutter, ingredients_number=5)` (run 2)
- Step 4.8, run 1, result, duration and pizza name: All specs passed, 2 tests passing, 00:17 (pizza-scenario.cy.js 00:13), Lab Pizza 20261113-163759
- Step 4.8, run 2, result, duration and pizza name: All specs passed, 2 tests passing, 00:18 (pizza-scenario.cy.js 00:13), Lab Pizza 20261113-163838
- Step 4.9 (optional), browser and result: not done

## Part B
1. QuickPizza gives the three number boxes of the Advanced form the same id, floating_filled, and `$$("#floating_filled").length` in the Console returned 3, so an id cannot pick Max Calories per Slice. The tests therefore start from the label: Robot uses `xpath://label[contains(.,'Max Calories')]/../input` and Cypress uses `cy.contains('label', 'Max Calories per Slice').siblings('input')`, and each finds exactly one box. I would give every box its own id, for example `max-calories`, `min-toppings` and `max-toppings`, or a `data-testid`. A tester then writes `id:max-calories`, a locator that does not depend on the wording of the label or on how the label and the box sit next to each other, so it survives a new label text or layout and reads clearly in the test.

2. Step 7 compares two outputs of the system under test, the tool in the recommendation of step 4 and the tool in the admin list, and has no expected value of its own. That makes it a consistency check between two views of the same data, a partial or pseudo oracle, and not a check against a known correct result. It would catch a fault in which the server saves the pizza with a different tool than the one it showed to the customer. In my Cypress run 2 both showed Pizza cutter, but a server that stored a default tool, or a stale pizza, would make the line `(tool=...)` differ from the page. If the pizza were not saved at all, the same step would fail already at the search for the pizza name.

3. QP-01 checks the name, the tool and the calories, but it never looks at the ingredients, so a meat topping on a pizza that was requested as vegetarian would pass. A check could read the ingredient list of the answer, the bullet list on the page or `pizza.ingredients` in the POST /api/pizza answer that Step 4.6 already captures with cy.intercept, and compare every ingredient with a list of vegetarian ingredients. The test needs that reference list from a source other than the answer itself, for example a fixed test data file or an ingredients endpoint of the site that marks each ingredient as vegetarian. The `vegetarian` field in the answer is not enough, because it comes from the same code that the test checks.

4. Robot Framework waited with explicit keywords: `Library SeleniumLibrary timeout=10s` gave every Wait keyword ten seconds, and I wrote `Wait Until Element Is Visible css:h1`, `Wait Until Element Contains id:recommendations Name:` and a `Wait Until The Page Is Ready` for the element svelte-announcer before logging in. Cypress waited without a line from me, because every cy.get and should retries for the 10 seconds of defaultCommandTimeout, and only cy.wait('@pizza') waits for a named request. Both versions passed QP-01 on the first full run, and the passing runs took 17.8 s and 11.6 s in Robot against 13 s and 13 s for the pizza spec in Cypress; Cypress needed more setup work, because npm 12 blocked the install script and `npx cypress verify` failed until I ran `npm install-scripts approve cypress`. The Robot log.html shows each keyword with its message and the screenshots at the step, and a failure gives one clear line (`Title should have been 'Web Form' but was 'Web form'.`), while the Cypress video shows the command log next to the page and its failure prints a diff after the 10 s of retries.

5. I would choose Cypress for the automated UI tests of Project 2. First, its retrying commands removed every explicit wait in my spec, and the four runs of QP-01 passed without a sleep or a wait keyword of my own, while the Robot version needed a separate wait line for each late element. Second, cy.intercept let the test check the request and the answer behind the page in Step 4.6: the request carried maxCaloriesPerSlice 600, and the page showed the same tool and calories as the server sent. With `video: true`, one command also saved the video and the screenshots for the evidence that the project asks for.

6. For Part 3: if QuickPizza changed the locator of the calories box, I would change one line, the variable `${MAX CALORIES}` in the Variables section of `resources/quickpizza.resource`. `pizza_scenario.robot` never names that locator. It only calls `Fill In The Pizza Request 600 Knife ${name}`, and the keywords `Turn On Advanced` and `Fill In The Pizza Request` in the resource file use the variable. So the test file stays as it is, and every test that imports the resource file works again after the one repair.

7. For Part 4: Cypress clears the cookies before each test. QuickPizza runs on several servers, and a cookie keeps one browser on one server, and the admin list shows only the pizzas of that server. If steps 6 and 7 were a second test, the browser would start without the cookie, could land on another server, and `cy.contains('li', pizzaName)` would not find the pizza of step 4 and would fail after the 10 seconds of retries. The constant `pizzaName` and the alias `@tool` also belong to the first test, so the second test would not even know which pizza or which tool to look for. QP-01 therefore has to stay one test, from the heading to the admin list.
