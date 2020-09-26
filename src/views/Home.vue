<template>
	<div class="home">
		<RecordOnline></RecordOnline>
	</div>
</template>

<script>
// @ is an alias to /src
import RecordOnline from '../components/recordOnline.vue'

export default {
	name: 'Home',
	components: {
		RecordOnline
	}
}
</script>
