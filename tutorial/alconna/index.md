<script setup>
import { onMounted } from 'vue';
onMounted(() => {
  if (typeof window !== 'undefined') {
    window.location.replace('/tutorial/alconna/v1');
  }
})
</script>
