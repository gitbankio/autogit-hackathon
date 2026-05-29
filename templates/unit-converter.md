---
title: Unit Converter
app_type: unit-converter
wallet: 0xFaE333D8513047783a5A281a0d2b67d563564AF4
---

A small page that converts numbers between units. Length, mass, volume, temperature, time, and a small currency snapshot. The visitor picks a category, picks a unit on each side, types a number, the page shows the converted value with the right precision and the right formatting for the visitor's locale. There are no signup, no ads, no analytics.

## the categories

The top of the page holds a horizontal row of six small chips in 14px Geist 500. length, mass, volume, temperature, time, currency. The active chip is filled copper with soft white text and a 2px copper ring. Tapping a chip switches the conversion form below.

### length

Units, in alphabetical order, kilometer, meter, centimeter, millimeter, mile, yard, foot, inch. Internally the page holds every length as a Number in meters, conversions are simple multiplications.

### mass

Units, kilogram, gram, milligram, ton (metric), pound, ounce. Internally held in grams.

### volume

Units, liter, milliliter, cubic meter, gallon (us), quart (us), pint (us), cup (us), fluid ounce (us), tablespoon, teaspoon. Internally held in milliliters.

### temperature

Units, celsius, fahrenheit, kelvin. Temperature is the only category where the formula is not a simple ratio, the page does the offset and scale through dedicated functions, never through a multiplication.

```
celsius to fahrenheit = celsius * 9 / 5 + 32
fahrenheit to celsius = (fahrenheit - 32) * 5 / 9
celsius to kelvin     = celsius + 273.15
```

### time

Units, second, minute, hour, day, week, month (30 days), year (365 days). The month and year units carry a small italic note in 11px sage muted reading approximate, no calendar logic.

### currency

A snapshot of the eight most traded currencies. usd, eur, gbp, jpy, cny, chf, cad, aud. The rates are fetched once at boot from a public no key endpoint, cached in IndexedDB under a store named rates with the iso date as the key, refreshed at most once per twelve hours. The page never tries to be a real exchange, the rates are visibly snapshots with a small italic 11px line below the currency form reading rates from <date>, not for transactions.

## the form

Below the chips, the conversion form. Two large columns side by side, on desktop. Each column is a single number input in 32px Fragment Mono midnight on a soft white card with a 1px midnight hairline at fifteen percent opacity, with a dropdown above the input showing the unit name in 14px Geist 500. The dropdowns are populated from the active category's unit list.

The visitor types into either side, the other side updates in real time. The conversion runs on every keystroke through a small in source table of ratios.

A small text button between the two columns reads swap. Tapping it swaps the two units, useful when the visitor wants the inverse conversion. The current value transfers to the other side.

Below the columns, a small italic 12px Geist sage line shows the conversion ratio in plain text, like 1 meter equals 3.281 feet. A second small italic 11px line in sage muted shows the exact ratio used internally, like 0.3048 meters per foot.

The shape of one ratio entry, written into src/lib/ratios.ts.

```
{
  category: 'length',
  unit:     'foot',
  toMeters: 0.3048,           // multiplier to base unit
  symbol:   'ft',
  precision: 3                // default decimal places for this unit
}
```

## the precision

The number on each side is formatted through Intl.NumberFormat in the visitor's locale, with the precision controlled by the category and the magnitude of the result. A length of 1 kilometer displays as 1,000 m on the meter side (or 1 000 m in fr locale, 1.000 m in de locale). A temperature of 100 celsius displays as 212 fahrenheit (no decimals, since the visitor asked for an integer). A currency value of 1.234567 usd in eur displays as 1.13 eur (two decimals, since that is the convention).

The precision is configurable through a small slider below the columns, default 4 significant figures. The visitor can drag the slider from 1 to 12, every keystroke or drag rerenders the values.

For very small or very large numbers (below 0.001 or above 1,000,000) the page uses scientific notation through the notation option of Intl.NumberFormat, formatted as a coefficient with a power of ten suffix.

## the history

Below the form, a small horizontal row of the last 8 conversions the visitor performed. Each entry is a small Geist 12px line showing both sides like 1 mile = 1.609 km, with a small remove glyph. Tapping a history row restores both units and both values. The history persists in localStorage. A small text button at the right of the row reads clear, with a confirm.

## the swap chip

A small text button at the bottom right of the page in 13px Geist sage reads swap to dark mode. Tapping it inverts the palette to midnight background, soft white text, copper accent still as is. The choice persists in localStorage.

## the edges

A number that overflows the Number range (rare in unit conversion, but possible for currency at large scales) falls back to a BigInt path where the integer portion is held in BigInt and the fractional portion in a separate Number. The result is formatted with full precision in the integer part and the default precision in the fractional part. A small italic 11px line below reads using bignum for large values.

A unit that does not have a sensible conversion (mass to length, for example) is prevented at the dropdown level, both sides only show units from the active category.

A negative value in temperature is allowed (cold readings work). A negative value in length, mass, or volume is allowed (the page does not assume positivity) but a small italic 11px line shows below the input reading negative values are unusual here.

A currency rate fetch that fails on boot uses the cached rate from IndexedDB if any. If no cache exists, the currency category shows a single italic 14px line reading rates are not available without a network on first load, the other five categories work.

## the build

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding soft white, midnight, copper, sage. Vite as the build tool. State is plain useState and one useReducer for the active category, the two unit selections, the two values, and the precision slider. No router, no global store, no context provider, no unit conversion library, no currency library, no icon pack. Number, BigInt, Intl.NumberFormat, fetch with AbortController, and IndexedDB are used directly.

Files. index.html with the Fragment Mono and Geist links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the category, the two units, the two values, the precision, the rate cache, and the history. src/components/Categories.tsx for the six chips. src/components/Form.tsx for the two columns. src/components/Precision.tsx for the slider. src/components/History.tsx for the last 8 entries. src/lib/ratios.ts for the unit table. src/lib/convert.ts for the conversion function including the temperature formulas and the BigInt path. src/lib/rates.ts for the currency rate fetch and the IndexedDB cache. src/lib/storage.ts for the localStorage. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a laptop. The soft white surface paints, the six chips sit at the top with length active, the two columns wait for input. They type 100 on the left with meter selected, foot is selected on the right, the right side updates to 328.084 immediately. They tap mass, swap to pound and kilogram, type 150 pound, the kilogram side reads 68.039. They tap currency, the rates settle from a fresh fetch, type 100 usd, the eur side reads 92. They reload the next day, the history of conversions is intact, the rates are read from the cache.
