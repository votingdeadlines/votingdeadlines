<style>
p {
  margin-top: 0;
  font-size: 14px;
  text-align: center;
  color: var(--taglineGray);
}

@media screen and (min-width: 900px) {
  p {
    font-size: 16px;
  }
}


p a {
  color: red !important;
}

p a:visited {
  color: red !important;
}
</style>

<script lang="ts" type="text/typescript">
export let className = ''
</script>

<p class="{className}">
  <slot />
</p>
