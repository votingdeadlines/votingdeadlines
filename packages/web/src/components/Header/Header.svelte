<style>
:root {
  /* Layout */
  --logoGraphicWidth: 28px;
  --logoGraphicHeight: var(--logoGraphicWidth);
  --logoTypeFontSize: 14px;
  --logoTypeMarginTop: 2px;
  --logoTypePaddingLeft: 8px;

  /* Colors */

  --logoGray: rgba(0, 0, 0, 0.1);
  --titleBlack: rgba(0, 0, 0, 0.8);
  --underlineRed: var(--brandRed);
  --subtitleGray: hsl(0, 0%, 67%);
}

/* Layout */

header {
  /* If not in <main> column */
  padding: 16px 18px;
  display: flex;
  align-items: baseline;
}

header > a {
  flex: 1;
  display: inline-block;
  /*margin: -2px 0 0 -2px;*/
  display: flex;
  align-items: baseline; /* aligns copy */
}

header a:hover {
  text-decoration: none;
}

.release {
  display: none;
}

.header-right {
  display: none;
}

@media screen and (min-width: 900px) {
  header > a {
    justify-content: flex-start;
  }

  .release {
    display: unset;
  }

  .header-right {
    display: unset;
  }
}

#logo {
  height: var(--logoGraphicWidth);
  width: var(--logoGraphicHeight);
  margin: 0;
  align-self: flex-end; /* removes logo from baseline alignment */
}

#logo svg {
  width: 100%;
  height: 100%;
  display: block;
}

.title {
  font-family: 'Montserrat', var(--fontFamilySystem);
  font-weight: 800;
  font-size: var(--logoTypeFontSize);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: var(--logoTypeMarginTop);
  padding-left: var(--logoTypePaddingLeft);
}

.title-copy {
  color: var(--titleRed);
  color: var(--titleBlack);
}

.title-copy .words {
  padding-bottom: 1px;
  border-bottom: 3px solid var(--underlineRed);
}

.title-copy .voting {
  color: var(--titleBlack);
}

.title-copy .period {
  padding-left: 2px;
}

/* TODO: simplify the logotype markup and styles */
.release {
  font-family: var(--fontFamilySystem);
  font-weight: 400;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.25;
}
</style>

<script lang="ts" type="text/typescript">
import { version } from '../../../package.json'

const edition = 'alpha'
const fullVersion = `v${version}-${edition}`
</script>

<header>
  <a href="/">
    <div id="logo">
      <svg
        width="301"
        height="301"
        viewBox="0 0 301 301"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="19"
          y="18.9999"
          width="282"
          height="282"
          fill="var(--logoGray)"
        ></rect>
        <rect y="-0.00012207" width="282" height="282" fill="white"></rect>
        <rect y="-0.00012207" width="282" height="80" fill="#D93D3A"></rect>
        <rect
          x="19"
          y="19"
          width="263"
          height="19"
          transform="rotate(90 19 19)"
          fill="var(--logoGray)"
        ></rect>
        <rect
          y="-0.00012207"
          width="282"
          height="19"
          fill="var(--logoGray)"
        ></rect>
        <path
          d="M163.02 163C175.287 165 184.687 169.6 191.22 176.8C197.754 183.867 201.02 192.667 201.02 203.2C201.02 211.333 198.887 218.867 194.62 225.8C190.354 232.6 183.82 238.067 175.02 242.2C166.354 246.333 155.687 248.4 143.02 248.4C133.154 248.4 123.42 247.133 113.82 244.6C104.354 241.933 96.287 238.2 89.6203 233.4L102.22 208.6C107.554 212.6 113.687 215.733 120.62 218C127.687 220.133 134.887 221.2 142.22 221.2C150.354 221.2 156.754 219.667 161.42 216.6C166.087 213.4 168.42 208.933 168.42 203.2C168.42 191.733 159.687 186 142.22 186H127.42V164.6L156.22 132H96.6203V106H194.62V127L163.02 163Z"
          fill="black"
        ></path>
      </svg>
    </div>

    <div class="title">
      <div class="title-copy">
        <span class="words"><span class="voting">Voting</span>
          Deadlines</span><span class="period">.</span>
        <span class="release">{fullVersion}</span>
      </div>
    </div>
  </a>

  <div class='header-right'>
    <a target="_blank" href="https://github.com/votingdeadlines/votingdeadlines">Source code</a>
    &nbsp;&nbsp;
    <a target="_blank" href="https://twitter.com/votingdeadlines">Twitter</a>
    &nbsp;&nbsp;
    <a target="_blank" href="https://mastodon.social/@votingdeadlines">Mastodon</a>
  </div>
</header>
