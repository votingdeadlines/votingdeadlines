<script lang="ts">
	import Nav from '../components/Nav.svelte';

	export let segment: string;
</script>

<style>
	main {
		position: relative;
		max-width: 920px;
		padding: 0 16px;
		margin: 0 auto;

		background-color: white;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>
