<style>

/********/
/* Type */
/********/

/* TODO: DRY body family and black in global.css. */

:root {
  --systemSansFontStack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;

  --taglineGray: hsl(0, 0%, 50%);
}

/*************/
/* Colors v1 */
/*************/


:root {
  /* Brand */

  --brandRed: hsla(1, 70%, 54%, 1);

  /* Map & Countdowns */

  --mapOpacity: 0.9;

  --ctRed1: var(--brandRed);
  --ctRed2: rgb(224, 91, 73);
  --ctRed: var(--ctRed2);
  --ctYellow2: rgb(239, 200, 73);
  --ctYellow3: hsl(46, 90%, 62%);
  --ctYellow: hsl(46, 86%, 67%);
  --ctGreen1: hsl(115, 60%, 50%);
  --ctGreen2: rgb(26, 188, 156);
  --ctGreen3: hsl(164, 78%, 44%);
  --ctGreen: var(--ctGreen3);

  --ctGray: hsl(0, 0%, 45%);
  --ctLightGray1: hsl(0, 0%, 80%);
  --ctMediumGray1: hsl(0, 0%, 50%);
  --ctDarkGray1: hsl(0, 0%, 20%);
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

/*:global(.mb4) {
  margin-bottom:2rem
}

:global(.mb5) {
  margin-bottom:4rem
}

:global(.mb6) {
  margin-bottom:8rem
}

:global(.mb7) {
  margin-bottom:16rem
}
*/
</style>

<!-- Seems necessary for this to be imported. Possibly should move to .css. -->
<aside></aside>
