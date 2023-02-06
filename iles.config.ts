import { defineConfig } from 'iles'

export default defineConfig({
  extendFrontmatter(frontmatter,filename) {
    if(filename.includes('/posts/')) {
      frontmatter.layout = 'post'
    }
  }
})
