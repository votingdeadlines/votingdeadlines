<style>
p {
  margin-top: 0;
  font-size: 16px;
  text-align: center;
  margin-bottom: 12px;

  color: var(--taglineGray);
}

@media screen and (min-width: 900px) {
  p {
    font-size: 18px;
    margin-bottom: 16px;
  }
}

p:last-child {
  margin-bottom: 0;
}

p a {
  color: inherit;
}

p a:visited {
  color: inherit;
}
</style>

<p>
  <slot />
</p>
