import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#586d8d',
        secondary: '#7285a3',
        accent: '#7285a3',
        error: '#e8a8ba',
      },
    },
  },
});
