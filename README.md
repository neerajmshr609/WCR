# Greyt.me

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.
Requirements
Node.js (version 20.x recommended)
npm (comes with Node.js)
Angular CLI (npm install -g @angular/cli)

## Install dependencies

Key `--legacy-peer-deps` is used to avoid errors with incompatible peer dependencies.

npm install --legacy-peer-deps

## Development server

Before running the dev server, you need to add `.env` file in root, this file you can ask the team.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Local development server

Before running the local server, you need to add .env file in root, this file you can ask the team.

Run `ng s -c local` or `npm run local`. The app will be extract data from local back-end server - `http://localhost:3000`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Commit changes

Before commit husky run commands `run prettier:fix` && `git add .` after that it will automatically commit

## Running check or fix prettier issues

Run `npm run prettier:check` for check format issues and `npm run prettier:fix` for fix format issues automatically

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Project structure

```
src/
├── app/ # Main application code
│ ├── auth/ # Authentication module
│ ├── pages/ # Application pages
│ │ ├── admin/ # Admin panel
│ │ ├── get-help/ # Get help module
│ │ ├── conversation/ # Chat and communication module
│ │ ├── conversations/ # List conversation module
│ │ ├── open-requests/ # Open request module
│ │ ├── creatives/ # Projects module
│ │ ├── rateflow/ # Rate projects module
│ │ ├── upload/ # Upload / Edit project module
│ │ ├── usersettings/ # Organization or user settings module
│ │ └── profile/ # User Profile module
│ ├── services/ # Application services
│ ├── shared/ # Shared components and utilities
│ │   ├── icons/ # Project icons 1 icon 1 component
│ └── app.module.ts # Root module
├── assets/ # Static resources (images, translations)
│ ├── i18n/ # Localization files
│ └── ...
├── environments/ # Configurations for different environments
└── ...
```

--------------------------------------------------------------------------------------------

# Content

--------------------------------------------------------------------------------------------

## Tools
### Application language and translations
#### 1. Import in module
#### 2. Import in nested module and translator scope
#### 3. Dictionaries
#### 4. Using translate in templates

--------------------------------------------------------------------------------------------

# Documentation

--------------------------------------------------------------------------------------------
## Application language and translations
### 1. Import in module

To import translate module into your module you need to add into imports of module decorator next code:
```
TranslateModule.forChild(createForChildProviderConfig('<folder name with translations>'))
```
In constructor of module class you need to subscribe your local translate service onto global, so insert next code:

```
constructor(
    private readonly _languageService: LanguageService,
    private readonly _translateService: TranslateService
  ) {
    effect(() => {
      this._translateService.use(this._languageService.currentLanguageCode());
    });
  }
```

### 2. Import in nested module and translator scope

When you use translate service, or translate pipe in component, their translations scope is in module where component is rendering
If you have component declared in shared module, but it's using in  OtherModule, translations wil work in scope of OtherModule.

In case if you have module nested in other module, but you need to use parent's module translations scope, you should import in nested module just class name of Translate module, without call "forChild" method:
```
@NgModule({
  imports: [
    ....
    TranslateModule
  ]
})
```

### 3. Dictionaries

All dictionaries are placed in folder `src/assets/translations/<folder_name_passe_in_module_imports>`
Each dictionary is json file, named with according language code. For example, if you need texts in English they all in en.json.
Dictionaries json objects shouldn't have nested properties deeper than 2 layers:

!!! correct:
```
{
  "header": {
    "login": "Log In"
  },
  "auth_status": {
    "not_authorized": "Not authorized"
  }
}
```

!!! not correct:
```
{
  "header": {
    "login": "Log In",
    "auth_status": {
      "not_authorized": "Not authorized"
    }
  }
  
}
```
All properties key name in snake case. 

### 4. Using translate in templates

To replace static text in template use next syntaxes:

```
  {{ 'header.login' | translate }}
```
Interpolation where you pass into translation pipe string which contains path of keys from property in according dictionary.

If you output text contains html use innerHtml binding instead interpolation:

```
{
  "header": {
    "login": "Log<br/>In"
  }
}

```
in template:

```
  <span [innerHtml]="'header.login' | translate" ></span>
```

Also, you can pass object with value into translation pipe:
```
 {
    "clicker": {
      "clicked_times": "Button have beed clicked {{ clickAmount }} times"
    }
 }
```
in template:

```
 <button>{{ 'clicker.clicked_times' | translate: { clickAmount } }}</button>
```

### ngx-translate docs: https://ngx-translate.org/






# CI/CD

## Running Frotend GitHub actions
0. Enter these variable to GitHub environments's secrets (if not entered):
```
ACCOUNT_ID - AWS account ID.
SSH_USER - The default user of your EC2 instance.
SSH_IP - The Elastic (or public) IP of your EC2 instance.
SSH_KEY - The private SSH key you use to connect to your EC2 instance.
SECRET_KEY - The CI_user's secret key. 
ACCESS_KEY - The CI_user's access key. 

etc (application vars those announced in the Dockerfile-backend and backend_ci.yml)
```

You will not be able to see secrets after enter them. You can only connect to environment server and execute:
```
docker inspect frontend
```
to see passed secrets.

1. Run Frontend CI BUILD action and select:
- Your destination environment.
- Image tag you want to build and push to ECR.
- Region (eu-central-1 is used by default).
2. Run the Docker-compose deploy action in an infrastracture repository (wcr-common) with builded applications tags.

Changes will applies in ~10 minuts.

## How to add new variables?
1. Add new secrets of your application to responsable envirenment.
2. Add new ARGs and ENVs to the Dockerfile-frontend.
3. Add variables to frontend_ci.yml.

Attention the environment is a infrastracture invirenment and it's not related to the code. 

## How to see logs?
### Using monitoring
```
None
```
### Using direct connection
You need to ssh into the environment server and run:
```
docker logs frontend
```
