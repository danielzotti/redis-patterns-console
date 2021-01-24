# COMMENTS

***DISCLAIMER***: All the sentences are intended as friendly advices, and it's not my intention to judge the developers
who had worked on this project. All the contents are my ideas, and I know there are other people who might not agree
with.

## UX/UI improvements

- On mobile, all sections except `REDIS RESPONSES` and `Insert command` disappear. Might be good to have a collapsible
  menu to open these sections, if needed.
- Open external links in a new tab
- Autoscroll in `COMMANDS` section on command selection all over the app
- Add `/#run` in the url is "ugly"
- Once you browse the history with arrow up key, the message "No command enter" should be removed
- Server doesn't work if value has spaces! e.g. `SET test "ciao"` works, `SET test "ciao come va?"` doesn't (see fix
  in `Redis server` section)

## Errors and warnings + possible solutions

- **ERROR:** tslint errors on git clone (e.g. strange character (​) used as new line char)
    - might be good to force users to run `npm run lint` before git commit. See for
      example [git pre-commit hook](https://levelup.gitconnected.com/how-to-run-eslint-using-pre-commit-hook-25984fbce17e)
    - might be worth trying to use [prettier](https://prettier.io/docs/en/comparison.html) instead
- **WARNING:** add `package-lock.json` to source control (Best practice. Node display this
  warning: `created a lockfile as package-lock.json. You should commit this file.`)

## Code style

- Why did you use the `tr` prefix? What does it mean? `tr` could be interpreted as something related to `<tr>`
- Instead of using `.interface.ts` suffix for files, I personally like to use the `.model.ts` suffix because in that
  files you might have also `class`es or `type`s definitions.
- I personally prefer splitting `services` between:
    1. `api services` -> they simply manage API calls, they have no dependencies (except for Http)
    2. `services` -> General purpose Angular services
- I would create a `Dashboard` smart component, which contains the application state (dashboard state in this case). It
  could manage the changes of the state and the API calls. Plus, if you want to add a new page, you can simply put
  the `header` and the `router-outlet` in the `app.component` and you can manage all the new pages simply adding it.
- I really like to use the prefixes `is` and `has` on (almost) every boolean value (e.g. isAuthorized, isVisible,
  hasDone, ...). This immediately let you know which type of value has a variable (without jumping up and down through
  the code or passing the mouse over the variable name).
- I like to maintain a coherence on variable names (e.g. all the observables has the suffix `$`). As far as it concerns
  this project, I found a couple of BehaviorSubject variables without the suffix `Subject` (that I noticed you have used
  to define this kind of variables).
- I like to split a component in all its 3 main files:
    1. html template `*.component.html`
    2. styles (preferably SCSS) `*.component.scss`
    3. logic `*.component.ts`

  I think this might be useful if you deal with a "pure" UI developer who works just with HTML&CSS files. Plus, if a
  component doesn't have the SCSS file, you are sure that there is no additional styling. Vice versa if you use a mixed
  approach, you are forced to open every TypeScript file in order to know if a component has some styles in it.

- I would always keep the same members order on each file, for example:
    - constants (or variables from the `environment` file)
    - public fields
    - private fieldsThis doesn't work with string value with spaces!
    - @Input & @Output
    - constructor
    - angular methods (ngOnInit, ngAfterViewInit, ...)
    - public methods
    - private methods
- I also like to put together fields which have the same "scope/meaning" (e.g. fields that manage the authentication are
  put together)
- I usually type every variable and method, except when type is immediately inferred (
  e.g. `const text = 'This is a text'`)
- I know it's a good practice to have a `Subject`/`BehaviorSubject` (to change the value) and an `Observable` linked to
  it (to read the value), but I personally prefer to use just the BehaviorSubject and use it internally to change the
  value (`.next()`) [`command.service.ts`]
  and out of the service just to subscribe to it (`.subscribe()`). It simplifies the code and it saves some boilerplate
- I didn't understand why you have transformed the object command (retrieved from GitHub) into an array. Isn't easier to
  access an object by key? [`command.service.ts`]

## `github-data.service.ts`

- Why did you use a getter for `isAuth` instead of using an Observable linked to the Subject as you did all over the
  app?

```typescript
// CURRENT CODE
isAuthorizedSubject = new BehaviorSubject<boolean>(false);
get
isAuth()
:
Observable < boolean > {
  return this.isAuthorizedSubject.asObservable();
}
```

```typescript
// PROPOSED CODE
isAuthorizedSubject = new BehaviorSubject<boolean>(false);
isAuth$: Observable < boolean > = this.isAuthorizedSubject.asObservable();
```

## `header.component.ts`

- Why did you change the name of the input (aliasing)?

```typescript
// CURRENT CODE
@Input('isAuth')
set
islogged(data
:
boolean
)
{
  this.isLogged = data;
  this.changeDetectorRef.detectChanges();
}
```

```typescript
// PROPOSED CODE
@Input()
isAuth
:
boolean;
```

## Technologies and dependencies

- Bootstrap is a useless dependency because it's not used on its full potential (it seems it had been used just for
  simple responsive feature)

## Improvements by Daniel

- General refactor
    - Same members order: constants,public fields, private fields, @Input & @Output, constructor, angular methods (
      ngOnInit, ngAfterViewInit, ...), public methods, private methods.
    - Same naming convention (observable$, testSubject, ...)
    - Every component with `.html`, `.ts`, `.scss` (if used)
    - ...
- UI responsive improvements
- Got rid of Bootstrap (all custom scss)
- Themes
    - TODO: default CSS values (e.g. `var(--header-color, #FFF)`)
    - TODO: custom theme for each component
- New component `ScrollableContent`
    - Auto resize the content height + scrollbar (you don't need to do it manually anymore!)
    - TODO: test performances on resize
    - TODO: Input with "trigger height calculation"
- New component `ThemeSelector`
- FIX [`dashboard.component.ts -> runCommand`]: If a command is written lowercase, the redis service doesn't execute the command!

## Improvements ideas

- service worker (e.g. prefetch of docs file to improve the UX)
- On mobile, all sections except `REDIS RESPONSES` and `INSERT COMMAND` disappear. Might be good to have a collapsible
  menu to open these sections. Alternatively, we could create 2 different pages for mobile (1. patterns, 2. docs)
- resize fonts (mobile vs desktop)

# Redis server
- FIX: Command `SET` doesn't work with values with spaces!
```typescript
// OLD VERSION
const commandArray = commandString.split(" ");

// NEW VERSION (FIX)
// This covers this basic case:
//  SET test "Ciao come va?"
// But not these cases:
//  SET test 'Ciao come va?'
//  SET test 'Uso l\'apostrofo'
//  SET test "Egli disse: \"Ciao!\""
const commandArray = commandString.split(/(\w+|"[^"]+["])/g).filter(i => i.trim() !== '');
```
