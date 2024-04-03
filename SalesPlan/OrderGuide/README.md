# Order Guide Tool

## What it does

Takes the sales plan the company gives you and converts it into a printable, scannable document that you can use to quickly order for the sales plan.

## How it works

1. Download the XLSX sales plan spreadsheet from Next, filtered to only the Dairy Bunker section.
2. Convert or save the file to comma-delineated CSV
3. Navigate to the [Application](OrderGuide.html)
4. Paste the CSV into the text area
5. Print to PDF and email to your work address

## How it works, but more interesting

This app uses a [bespoke static SPA builder](build.js) that takes [template.html](template.html) and injects the source files into it.

### Sources

#### [main.js](main.js)

The application logic. Parses the CSV, creating an object representing the data. It then wipes the main container and builds the order guide from that data. It's all very hacky, but it didn't make much sense to pull in a library to do something so simple. In my experience so far, the spreadsheet has a consistent number of columns, and the columns consistently contain the data I assume it does.

#### [style.css](style.css)

Simple formatting, just enough to make it so that it prints on as few pages as possible while still being scannable. The UPC font is a godsend, it does all the legwork, even computing the check digit.

#### Dependencies

There are none, really. Nodemon is a dev dep. I've used it while fiddling with things so I don't have to keep running to the terminal to run `node build.js` again.

Should I consider fonts a dependency? IDK, but there are a couple in the CSS.

## The future of this application

I consider this to be in a 1.0 state. It's not perfect, but it does the job as well as it should. It should only need fixing if the format of the spreadsheet changes. Most of the changes I've made in the last month have been presentation related.

### Ideas for improvement

- Break out the period and week for the start and end of display, then show that status

> e.g. data says P3W2 - P3W3 it could say something like "First week of two"
>
> e.g. data says P1W2 - P3W4, and it's currently P2W2, it could say "Week 5 of 10"

- Craft tests to ensure that changes work without having to manually verify

> There are sample CSV files inside `tests/`

- Take out the middle man and get the data directly from the XLSX file. This would be awesome because then you could just put a freshly-built `OrderGuide.html` on your work onedrive and use the application there.