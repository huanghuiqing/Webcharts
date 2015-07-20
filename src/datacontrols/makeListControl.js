Controls.prototype.makeListControl = function(control, control_wrap){
    var changer = control_wrap.append("input").attr("type", "text").attr("class", "changer").datum(control);
    context.targets.forEach(function(e){
      if(e.config[control.option])
        changer.property("value", e.config[control.option]);
    });
    
    changer.on("change", function(d){
      var value = d3.select(this).property("value") ? d3.select(this).property("value").split(",").map(function(m){return m.trim()}) : null;
      context.targets.forEach(function(e){
        if(!e.config[d.option])
          e.config[d.option] = {};
        e.config[d.option] = value;
        e.draw();
      });
    });
  };