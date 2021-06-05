import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    defaultContent: `
    # Hi, This is the default content
 
    ## Edit or delete it and begin writing your own
    
    ### Header 3
    
    Lorem ipsum sit amet.
    
    **bold** *italic* _underline_
    
    [col-left]Content in the left column[/col-left][col-right]Content in the right column[/col-right]
    
    This is a [link](https://exemplar.com)
    
    [img=”https://via.placeholder.com/350x150”]
    
    [col-left][img=”https://exemplar.com/image.jpg”][/col-left][col-right][img=”https://exemplar.com/image.jpg”][/col-right]
    
    [table]
    [row][col-left]**Make it bold**[/col-left][col-right]**Make it bold**[/col-right][/row]
    [row][col-left]Content in the left column[/col-left][col-right]Content in the right column[/col-right][/row]
    [row][col-left]Content in the left column[/col-left][col-right]Content in the right column[/col-right][/row]
    [/table]
    `,
  },
  mutations: {},
  actions: {},
  modules: {},
});
