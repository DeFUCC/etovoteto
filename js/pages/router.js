import AuthorPage from './author-page.js'
import WordsPage from './words-page.js'
import DescPage from './desc-page.js'

// ROUTER Config

export default new VueRouter({
//  mode: 'history',
  routes:[
    {path:'/author', component:AuthorPage},
    {path:'/', component:WordsPage},
    {path:'/desc', component:DescPage}
  ]
})
