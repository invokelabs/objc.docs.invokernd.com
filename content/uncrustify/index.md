---
layout: default
title: Uncrustify
slug: Uncrustify
base_url: "/"
---
For quick reference, the uncrustify.cfg file that conforms to the Invoke Objective-C style guide is located [here](http://objc.docs.invokernd.com/content/uncrustify/uncrustify.cfg).

##Overview

Uncrustify is a tool to reformat you code to a standard that you are able to define. Although it is not able to enforce standards for things like variable naming etc. It sorts out all the issues to do with white space, bracket placement, indenting etc. All in all, not a complete replacement for internalizing the style guide, but it gets someone who refuses to read the style guide a lot closer to readable code.


##Installing Uncrustify

1. Clone the following project onto your local machine with the command `git clone git://github.com/bengardner/uncrustify.git`
2. Navigate into the project folder and run `./configure`
3. Then run `make` when that has completed.
4. This will create, among other things, a file called `uncrustify.exe`. Move this file to `/usr/local/bin`.
5. Test that you have set this up correctly by running `uncrustify -h`. If the help file loads you're golden ;)

##Configuring Uncrustify

Uncrustify works with a config file that *you* will theoretically set up (most likely you'll just download one and tweak it a bit). This file has a whole bunch of options which you can specify the details for. Ultimately, it is these details that will be carried out when you execute the program on your file(s). This Config file can be set up in a text editor but that would be pretty rough. Fortunately, there is also a GUI you can use to assemble things which is a lot more reasonable. These instructions assume you will want to use the GUI.

1. Download the [Universal Indent GUI](http://sourceforge.net/projects/universalindent/files/uigui/) or the latest version of [UncrustifyX](https://github.com/ryanmaxwell/UncrustifyX/releases) and install/run it. Both work principally the same but UncrustifyX is probably more attractive to the eye.
2. In either case you are going to import a [sample config](https://github.com/benoitsan/BBUncrustifyPlugin-Xcode/blob/master/Resources/uncrustify.cfg) file or generate a blank text doc with the name `uncrustify.cfg`
2. Down the left column are all of the things you can have Uncrustify control. They can be turned on and off at your bidding.
3. With both editors you can also load a sample file with the `Live Indent Preview` option selected to visually understand the changes you're making to your code.
4. When you are done you can export your `.config` file and note the location.
5. Move this file to the top level of your xcode project folder as this is the first place that the plugin will look for your config specs. presumably you could include this file in your .gitignore file so that it is more of a local thing.

##Using Uncrustify

With a config file specified to your needs and in the right place you can now run Uncrustify on your obj-c files with the following command: `uncrustify -c ~/.uncrustify/mystyle.cfg -f somefile.c > somefile.c.unc` where the -c argument specifies the location of your config file and the -f argument specifies the input and output files that you are formatting.

Presumably, you would use this approach if you wanted to plow a whole batch of files through this formatter prior to committing them. In that case you could probably automate this with some sort of script. My personal recommendation however, would be to follow the next set of instructions to incorporate Uncrustify right into Xcode and use it continually from the very beginning of your project.

##The Xcode Uncrustify plugin

If you want to sort of run Uncrustify in a "hot" style it can be configured as a plug in for Xcode. Once installed there are various commands added to the `Edit` menu that let you exercise Uncrustify features.

###To install the plugin:

1. Clone the following repo on your machine: `https://github.com/benoitsan/BBUncrustifyPlugin-Xcode`
2. Build the xcode `.project` file and run it. 
3. Assuming that it runs successfully, close and reopen xcode
4. Open a file in your main view and select the `Edit` menu. at the bottom the Crustify features will be present. As a test you can select select `Uncrustify Active File` and you should see the specified formatting changes carried out. 
5. By default, there are no keyboard shortcuts for running these commands but think how bad@$$ it would be if you made them. . .

*Note:* If you first installed Uncrustify and then installed the plug in (as these instructions suggest) it is recommended that you switch the original build of Uncrustify instead of the build that comes packaged with the plugin. To do so, execute the following 3 commands


	cd ~/Library/Application\ Support/Developer/Shared/Xcode/Plug-ins/UncrustifyPlugin.xcplugin/Contents/Resources  
	mv uncrustify uncrustify.orig  
	ln -s /usr/local/bin/uncrustify uncrustify  


###Limitations

As mentioned at the beginning, Uncrustify can not sort out things that go beyond actual formatting so you are still responsible for naming conventions, correctly constructed conditional switchs and the like. For reference, [here](http://objc.docs.invokernd.com/content/uncrustify/uncrustify.cfg) is a config file that is as close as possible to the [Invoke Labs Objective-C](http://objc.docs.invokernd.com/content/uncrustify/uncrustify.cfg) style guide as Uncrustify can force you to be.

Additionally, below is a guide as to what this Uncrustify config will be formatting in your code to make it compile to the style guide and what is present in the style guide that this config file can not do.

---

####Things in the style guide that Uncrustify can/will enforce:  


#####Spacing
1. The use of a tab equaling 4 spaces for an indent.
2. All braces open on the declaration line but close on an independent line.
3. There should be exactly one blank line between method closes and the next declaration.

#####Methods
1. Correct spacing in method signatures/declarations including:  
	* spacing after the scope  
	* spacing between segments   
	* spacing between asterisks  
	* the lack of spacing in all the appropriate places   

#####Conditionals

1. Force the use of brackets for single conditionals.

#####Variables
1. Force pointer asterisks to belong to the variable not the Class.

**Note:** While it is not explicitly mentioned in the style guide, we have decided to place opening braces on a new line after the method definition yet before the body. This feature will be enforced in the config file.


---

####Things in the style guide that Uncrustify won't/couldn't do:  

  
#####Dot-Notation:
1. Force the use of Dot-Notation for accessing and mutating properties.
2. Force bracket notation for everything else.

#####Spacing:
3. Force the absence of whitespace within methods. (could do this, but there are times when it makes sense to have this).
4. `@synthesize` and `@dynamic` should be declared in new lines in the implementation.

#####Conditionals
6. Force the use of ternary Operators only to be used when they increase clarity.

#####Error Handling:
7. Force switching on the returned value as opposed to switching on the error itself.

#####Variables
8. Force the descriptive qualities of variable names.
9. Force the use of direct variable access in `init` methods only.

#####Naming
1. Force descriptive variable and method names as well as naming conventions for constants.
2. Camel casing.

#####Underscores
1. Force property access via `self.myProperty`.

#####Booleans
1. Stop the comparison of results to `nil`.
2. Stop the comparison of results to `YES/NO`.
3. Control the potential to drop the "is" in `BOOL` variable names.

#####Singletons
1. Force the use of thread safe singleton creation.


