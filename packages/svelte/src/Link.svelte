<style>
a {
  color: inherit;
}

p a:visited {
  color: inherit;
}
</style>

<script lang="ts" type="text/typescript">
export let href: string
</script>

<a href="{href}">
  <slot />
</a>
