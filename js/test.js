import zim from "https://zimjs.org/cdn/014/zim";

new Frame(FIT, 800, 800, light, dark, ready);
function ready(){
	new Circle(100, blue)
		.center()
		.drag();
}
