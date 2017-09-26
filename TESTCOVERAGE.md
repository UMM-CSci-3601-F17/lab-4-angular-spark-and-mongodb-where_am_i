# Test Coverage

We test all of the important behaviors of the todo portion of this application.

The tests for the todo list page are located in `client/e2e/todo-list.e2e-spec.ts` and the helper code is in `client/e2e/todo-list.po.ts`.

We test for:
- Todo title
  - We look for the todo page `h1` element. This is mostly to make sure the most basic testing setup is working.
- Search by body text
  - We enter a selection from one of the body texts into the search input and check that the todo returned has the correct owner and body.
  - This tests that the search box properly filters the list of todos.
- Filter by owner
  - We enter an owner into the owner input, in this case `Fry`.
  - We check that every todo in the list have `Fry` as their owner.
  - This tests that the owner filter properly filters by owner and doesn't return any todos with a different owner
- Filter by category
  - We enter a category into the category input, in this case `homework`.
  - We check that every todo in the list has `homework` in the category element.
  - This tests that the category filter properly filters by category and doesn't return any todos with a different category
- Filter by status
  - We change the status input to `Complete` and check that every todo in the list has `Complete` for its status.
  - We do the same thing for `Incomplete`.
  - These ensure that the status filter is working and only returning todos with the correct status.
- Filter by multiple filters at a time
  - We set the category input, owner input, and status input and check that every todo in the list has those attributes.
  - This is testing that we can filter by a combination of different filters and get back only the results that match them all.
