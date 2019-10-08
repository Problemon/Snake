"use strict"

function createAnimation () {
  let animationSegments = document.querySelectorAll(".segment-animation");
  let canvas = document.querySelector(".animation__background");
  let ctx = canvas.getContext("2d");
  
  let sizeAnim, blockSizeAnim, widthInBlocksAnim, heightInBlocksAnim;
  
  function setSize () {
    sizeAnim = size / 2.6;
  	canvas.width = sizeAnim;
  	canvas.height = sizeAnim;
  	blockSizeAnim = sizeAnim / 6;
  	widthInBlocksAnim = sizeAnim / blockSizeAnim;
  	heightInBlocksAnim = sizeAnim / blockSizeAnim;

    ctx.clearRect(0, 0, sizeAnim, sizeAnim);

    drawBackground(ctx, blockSizeAnim, widthInBlocksAnim, heightInBlocksAnim, sizeAnim);
  }
  
  setSize();
  window.onresize = setSize;

  function setAnimation () {
  	animationSegments.forEach( (i) => {
      i.style["transform"] = "translateX(-3.23em)"
  	});

  	setTimeout( () => {
      animationSegments.forEach( (i, id) => {
        if (id == 0) {
        	i.style["transform"] = "translate(-3.23em, 3.23em)";
        	i.style["flex-direction"] = "row";
        	i.style["align-items"] = "flex-end";
        } else if (id == 1){
        	i.style["transform"] = "translate(-6.46em, 0)";
        } else {
        	i.style["transform"] = "translate(-6.46em, 0)";
        }
      });
      setTimeout( () => {
        animationSegments.forEach( (i, id) => {
          if (id == 0) {
          	i.style["transform"] = "translate(-3.23em, 6.46em)";
        	  i.style["flex-direction"] = "row";
        	  i.style["align-items"] = "flex-end";
          } else if (id == 1){
          	i.style["transform"] = "translate(-6.46em, 3.23em)";
          } else {
          	i.style["transform"] = "translate(-9.69em, 0)";
          }
        });
        setTimeout( () => {
		      animationSegments.forEach( (i, id) => {
		        if (id == 0) {
		        	i.style["transform"] = "translate(-3.23em, 9.69em)";
		        	i.style["flex-direction"] = "row";
		        	i.style["align-items"] = "flex-end";
		        } else if (id == 1){
		        	i.style["transform"] = "translate(-6.46em, 6.46em)";
		        } else {
		        	i.style["transform"] = "translate(-9.69em, 3.23em)";
		        }
		      });
		      setTimeout( () => {
			      animationSegments.forEach( (i, id) => {
			        if (id == 0) {
			        	i.style["transform"] = "translate(0, 9.69em)";
		        	  i.style["flex-direction"] = "column";
		        	  i.style["align-items"] = "flex-end";
			        } else if (id == 1){
			        	i.style["transform"] = "translate(-6.46em, 9.69em)";
			        } else {
			        	i.style["transform"] = "translate(-9.69em, 6.46em)";
			        }
			      });
			      setTimeout( () => {
				      animationSegments.forEach( (i, id) => {
				        if (id == 0) {
				        	i.style["transform"] = "translate(3.23em, 9.69em)";
		        	    i.style["flex-direction"] = "column";
		        	    i.style["align-items"] = "flex-end";
				        } else if (id == 1){
				        	i.style["transform"] = "translate(-3.23em, 9.69em)";
				        } else {
				        	i.style["transform"] = "translate(-9.69em, 9.69em)";
				        }
				      });
				      setTimeout( () => {
					      animationSegments.forEach( (i, id) => {
					        if (id == 0) {
					        	i.style["transform"] = "translate(6.46em, 9.69em)";
			        	    i.style["flex-direction"] = "column";
			        	    i.style["align-items"] = "flex-end";
					        } else if (id == 1){
					        	i.style["transform"] = "translate(0, 9.69em)";
					        } else {
					        	i.style["transform"] = "translate(-6.46em, 9.69em)";
					        }
					      });
					      setTimeout( () => {
						      animationSegments.forEach( (i, id) => {
						        if (id == 0) {
						        	i.style["transform"] = "translate(6.46em, 6.46em)";
				        	    i.style["flex-direction"] = "row";
				        	    i.style["align-items"] = "flex-start";
						        } else if (id == 1){
						        	i.style["transform"] = "translate(3.23em, 9.69em)";
						        } else {
						        	i.style["transform"] = "translate(-3.23em, 9.69em)";
						        }
						      });
						      setTimeout( () => {
							      animationSegments.forEach( (i, id) => {
							        if (id == 0) {
							        	i.style["transform"] = "translate(6.46em, 3.23em)";
				        	      i.style["flex-direction"] = "row";
				        	      i.style["align-items"] = "flex-start";
							        } else if (id == 1){
							        	i.style["transform"] = "translate(3.23em, 6.46em)";
							        } else {
							        	i.style["transform"] = "translate(0, 9.69em)";
							        }
							      });
							      setTimeout( () => {
								      animationSegments.forEach( (i, id) => {
								        if (id == 0) {
								        	i.style["transform"] = "translate(6.46em, 0)";
					        	      i.style["flex-direction"] = "row";
					        	      i.style["align-items"] = "flex-start";
								        } else if (id == 1){
								        	i.style["transform"] = "translate(3.23em, 3.23em)";
								        } else {
								        	i.style["transform"] = "translate(0, 6.46em)";
								        }
								      });
								      setTimeout( () => {
									      animationSegments.forEach( (i, id) => {
									        if (id == 0) {
									        	i.style["transform"] = "translate(3.23em, 0)";
						        	      i.style["flex-direction"] = "column";
						        	      i.style["align-items"] = "flex-start";
									        } else if (id == 1){
									        	i.style["transform"] = "translate(3.23em, 0)";
									        } else {
                            i.style["transform"] = "translate(0, 3.23em)";
									        }
									      });
									      setTimeout( () => {
										      animationSegments.forEach( (i, id) => {
										        if (id == 0) {
										        	i.style["transform"] = "translate(0, 0)";
							        	      i.style["flex-direction"] = "column";
							        	      i.style["align-items"] = "flex-start";
										        } else if (id == 1){
										        	i.style["transform"] = "translate(0, 0)";
										        } else {
										        	i.style["transform"] = "translate(0, 0)";
										        }
										      });
										  	}, 150);
									  	}, 150);
								  	}, 150);
							  	}, 150);
						  	}, 150);
					  	}, 150);
				  	}, 150);
			  	}, 150);
		  	}, 150);
  	  }, 150);
  	}, 150);
  }
  setAnimation()

  intervalIdAnimation = setInterval( () => {
  	setAnimation();
  }, 1750);
}

createAnimation();