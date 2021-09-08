# Destructible Tower Defense


## Log 1:
Last Edited: {{ article.published_at | date: "%b %d, %Y" }}

<!-- [**Project Link**] -->

### Background:
After learning how to use Godot's 2D engine decently, I decided my origional mobile game idea wasn't anything amazing.
I started thinking about more of what I personally would like to play, and started thinking about what some fun mechanics would be.
Eventually I came to the conclusion that some form of base defense game with a fully destructible level would be interesting.
Next I would have to figure out how to build such a thing.

### Thoughts on the current state:
Currently there isn't too much to do in the "game".
I figured out how to split sprites into more sprites, which was surprisingly annoying as there are various places where scaling can change where things should be placed
relative to others. Anyways, here that is.
<image src="./quadTree.gif" alt="quadTreeGif"/> 

Next I just added some litte players to walk around the scene as well as some graphics to make it look like dirt being destroyed.
There's definately a slightly jaring texture change when one sprite is split into 4 with the same texture, but that can be fixed later.
As of right now, I am not sure the best way in which to make the AI work. I know I should probably use A* path finding, but the way
Godot is set up, I am not sure how to set up procedurally generated nodes for possible destinations as the map is destroyed.
Godot 4.0 promises to make this easier, though I may come up with a custom solution if I have the time.

### To Do:
- A working AI
- Defenses
- Menus
- Graphics
- Optimization
- Should I use quadTrees or should I use some line collision like I've seen other games do?

### Things Learned:
- Some ideas around quad trees and destructable terrains
- How most static path finding systems work in godot
