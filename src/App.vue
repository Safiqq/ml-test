<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>
      <h2>Upload Images</h2>
      <input type="file" @change="uploadImages" accept=".zip">
    </div>
    <div v-if="results.length">
      <h2>Prediction Results</h2>
      <ul>
        <li v-for="(result, index) in results" :key="index">
          <img :src="result.url" :alt="result.name" style="width: 100px; height: auto;"/>
          {{ result.name }} --- {{ result.prediction }}: {{ result.confidence }}%
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import JSZip from 'jszip'

export default {
  name: 'App',
  data() {
    return {
      results: []
    }
  },
  methods: {
    async uploadImages(event) {
      const file = event.target.files[0]
      const zip = new JSZip()
      const content = await zip.loadAsync(file)
      const imageFilesPromises = []

      content.forEach((relativePath, file) => {
        if (relativePath.endsWith('.jpg') || relativePath.endsWith('.png') || relativePath.endsWith('.jpeg')) {
          imageFilesPromises.push(file.async('blob').then(blob => ({ relativePath, blob })))
        }
      })

      const imageFiles = await Promise.all(imageFilesPromises)

      for (const { relativePath, blob } of imageFiles) {
        const formData = new FormData()
        formData.append('image', new File([blob], relativePath, { type: "image/jpeg" }), relativePath)

        // Create a URL for the blob to display the image
        const imageUrl = URL.createObjectURL(blob)

        const response = await fetch('https://fitfirst-ml-backend-haexo7tjpa-et.a.run.app/food/predict', {
          method: 'POST',
          body: formData
        })

        const prediction = await response.json()
        this.results.push({
          name: relativePath,
          url: imageUrl,  // Store the image URL
          prediction: prediction.food,
          confidence: (prediction.confidence).toFixed(2)
        })
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
