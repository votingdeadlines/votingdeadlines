<style>
/*[aria-current] {
}
*/
/*[aria-current]::after {
}
*/
</style>

<script lang="ts">
import Header from './Header/Header.svelte'
export let segment: string
segment // use if adding more sections
</script>

<nav>
  <!-- <ul> -->
  <!-- <li> -->
  <!-- <a aria-current="{segment === undefined ? 'page' : undefined}" href="."> -->
  <Header />
  <!-- </a> -->
  <!-- </li> -->
  <!-- <li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="about">about</a></li> -->

  <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
  <!-- <li><a rel=prefetch aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog">blog</a></li> -->
  <!-- </ul> -->
</nav>
