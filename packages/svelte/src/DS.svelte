<style>
/********/
/* Type */
/********/

/* TODO: DRY body family and black in global.css. */

:root {
  --systemSansFontStack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

/*************/
/* Colors v1 */
/*************/

:root {
  /* Brand */

  --brandRed: hsla(1, 70%, 54%, 1);

  /* Type */

  --taglineGray: hsl(0, 0%, 40%);

  /* Map */

  --mapOpacity: 0.9; /* DRY */

  /*--ctRed1: var(--brandRed);*/
  /*--ctRed2: rgb(224, 91, 73);*/
  --ctRed: hsl(7, 71%, 58%);
  --ctRed1CardBg: hsl(7, 71%, 78%);
  --ctRed2CardBg: hsl(7, 88%, 88%);
  --ctRedCardBg: var(--ctRed2CardBg);
  --ctRed1CardTextColor: hsl(7, 71%, 38%);
  --ctRed2CardTextColor: hsl(7, 70%, 35%);
  --ctRedCardTextColor: var(--ctRed2CardTextColor);
  /*--ctYellow2: rgb(239, 200, 73);*/
  /*--ctYellow3: hsl(46, 90%, 62%);*/
  --ctYellow: hsl(46, 86%, 67%);
  --ctYellow1CardBg: hsl(46, 86%, 87%);
  --ctYellow2CardBg: hsl(46, 77%, 86%);
  --ctYellowCardBg: var(--ctYellow2CardBg);
  --ctYellow1TextColor: hsl(46, 50%, 25%);
  --ctYellowCardTextColor: var(--ctYellow1TextColor);
  /*--ctGreen1: hsl(115, 60%, 50%);*/
  /*--ctGreen2: rgb(26, 188, 156);*/
  /*--ctGreen3: hsl(164, 78%, 44%);*/
  --ctGreen: hsl(164, 78%, 44%);
  --ctGreen1CardBg: hsl(164, 78%, 64%);
  --ctGreen2CardBg: hsl(164, 63%, 80%);
  --ctGreenCardBg: var(--ctGreen2CardBg);
  --ctGreen1TextColor: hsl(164, 78%, 24%);
  --ctGreen2TextColor: hsl(164, 60%, 20%);
  --ctGreenCardTextColor: var(--ctGreen2TextColor);

  --ctGray: hsl(0, 0%, 45%);
  /*--ctLightGray1: hsl(0, 0%, 80%);*/
  /*--ctMediumGray1: hsl(0, 0%, 50%);*/
  /*--ctDarkGray1: hsl(0, 0%, 20%);*/

  /* Countdown cards */

  --cardBgGray: hsl(0, 0%, 80%);
}

/***********/
/* Spacing */
/***********/

:global(.mb0) {
  margin-bottom: 0;
}

:global(.mb4) {
  margin-bottom: 4px;
}

:global(.mb8) {
  margin-bottom: 8px;
}

:global(.mb12) {
  margin-bottom: 12px;
}

:global(.mb16) {
  margin-bottom: 16px;
}
</style>

<!-- Seems necessary for this to be imported. Possibly should move to .css. -->
<aside></aside>
