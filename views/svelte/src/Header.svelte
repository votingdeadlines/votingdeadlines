<style>
/* Colors */

:root {
  --logoGray: rgba(0, 0, 0, 0.1);
  --titleBlack: rgba(0, 0, 0, 0.8);
  --underlineRed: hsla(1, 68%, 54%, 0.9);
  --subtitleGray: hsl(0, 0%, 67%);
}

/* Layout */

header {
  text-align: center;
  position: relative;
  display: flex;
  align-items: baseline; /* aligns copy */

  /* If not in <main> column */
  padding: 16px 18px;
}

header #logo {
  height: 48px;
  width: 48px;
  margin: 0;
  align-self: flex-end; /* removes logo from baseline alignment */
}

#logo svg {
  width: 100%;
  height: 100%;
  display: block;
}

header .title {
  font-family: 'Montserrat';
  font-weight: 800;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-top: 11px;
  padding-left: 20px;
}

header .title-copy {
  color: var(--titleRed);
  color: var(--titleBlack);
}

header .title-copy .words {
  padding-bottom: 1px;
  border-bottom: 3px solid var(--underlineGray);
  border-bottom: 3px solid var(--underlineRed);
}

header .title-copy .voting {
  color: var(--titleBlack);
  /*color: var(--titleRed);*/
}

header .title-copy .period {
  padding-left: 2px;
}

/* Subhead */

.subheader {
  display: none;
  text-align: right;
  color: var(--subtitleGray);
  font-size: 14px;
  flex-grow: 1;
}
</style>

<script lang="ts">
// export let title: string
</script>

<header>
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
      <span class="words"><span class="voting">Voting</span> Deadlines</span><span class="period">.</span>
      <!-- <span class='country'>USA</span> -->
      <!-- <span class='year'>2020</span> -->
    </div>
  </div>

  <div class="subheader">Updated XX hours ago (changelog)</div>
</header>
