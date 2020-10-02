<style>
.legend {
  display: flex;
  justify-content: center;
  margin-top: 12px;

  --squareWidth: 18px;
}

@media screen and (max-width: 800px) {
  .legend {
    flex-direction: column;
  }
}

.legend > div {
  display: flex;
  margin-bottom: 8px;
}

dt {
  margin-top: 1px;
  width: var(--squareWidth);
  height: var(--squareWidth);

  opacity: var(--mapOpacity);
}

.legend-red-square {
  background: var(--ctRed);
}

.legend-yellow-square {
  background: var(--ctYellow);
}

.legend-green-square {
  background: var(--ctGreen);
}

.legend-gray-square {
  background: var(--ctGray);
}

.legend-multicolor-squares {
  display: flex;
  justify-content: space-between;
  width: auto;
  /*background: red;*/
}

.legend-multicolor-squares svg {
  width: var(--squareWidth);
  height: var(--squareWidth);
}

.legend-multicolor-squares svg:first-child {
  margin-right: 8px;
}

div {
  margin-right: 20px;
}

div:last-child {
  margin-right: 2px;
}

dd {
  font-size: 14px;
  color: var(--taglineGray);
  margin-left: 8px;
}
</style>

<script lang="typescript" type="text/typescript">
// Imports
import Crosshatch from './Crosshatch.svelte'
import { COLOR_THRESHHOLDS } from './colorUtilities'

const { MIN_DAYS_V1 } = COLOR_THRESHHOLDS

let redDays = MIN_DAYS_V1.YELLOW // counterintuitively
let yellowDays = MIN_DAYS_V1.GREEN
let greenDays = MIN_DAYS_V1.GREEN // gt
</script>

<dl class="legend">
  <div>
    <dt role="img" aria-label="Red square" class="legend-red-square"></dt>
    <dd>{redDays} days or less</dd>
  </div>

  <div>
    <dt role="img" aria-label="Yellow square" class="legend-yellow-square"></dt>
    <dd>{redDays + 1}–{yellowDays} days</dd>
  </div>

  <div>
    <dt role="img" aria-label="Green square" class="legend-green-square"></dt>
    <dd>&gt;{yellowDays} days</dd>
  </div>

  <div>
    <dt role="img" aria-label="Gray square" class="legend-gray-square"></dt>
    <dd>N/A or passed</dd>
  </div>

  <div>
    <dt
      role="img"
      aria-label="Cross-hatched multicolor square"
      class="legend-multicolor-squares"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <Crosshatch
          id="legend-multicolor"
          backgroundFill="var(--ctGray)"
          hatch1Fill="var(--ctGreen)"
          hatch2Fill="var(--ctGreen)"
        />
        <rect width="18" height="18" fill="url(#legend-multicolor)"></rect>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
        <Crosshatch
          id="legend-multicolor2"
          backgroundFill="var(--ctYellow)"
          hatch1Fill="var(--ctYellow)"
          hatch2Fill="var(--ctGreen)"
        />
        <rect width="18" height="18" fill="url(#legend-multicolor2)"></rect>
      </svg>
    </dt>
    <dd class="multiple-deadlines">
      <div>Deadlines depend on method</div>
      <div>(online, mail, in person)</div>
    </dd>
  </div>
</dl>
