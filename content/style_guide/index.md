---
layout: default
title: Style Guide
slug: style_guide
base_url: "/"
---

* Table of Contents
{:toc}

# Dot-Notation Syntax

Dot-notation should **always** be used for accessing and mutating properties. Bracket notation is preferred in all other instances.

**For example:**
{% highlight objective-c %}
view.backgroundColor = [UIColor orangeColor];
[UIApplication sharedApplication].delegate;
{% endhighlight %}

**Not:**
{% highlight objective-c %}
[view setBackgroundColor:[UIColor orangeColor]];
UIApplication.sharedApplication.delegate;
{% endhighlight %}

# Spacing

* Indent using tabs, with a tab width of 4 spaces. Never indent with spaces. Be sure to set this preference in Xcode.
* Method braces and other braces (`if`/`else`/`switch`/`while` etc.) always open on the same line as the statement but close on a new line.

**For example:**
{% highlight objective-c %}
if (user.isHappy) {
  //Do something
}
else {
  //Do something else
}
{% endhighlight %}

* There should be exactly one blank line between methods to aid in visual clarity and organization. Whitespace within methods should separate functionality, but often there should probably be new methods.
* `@synthesize` and `@dynamic` should each be declared on new lines in the implementation.

# Conditionals

Conditional bodies should always use braces even when a conditional body could be written without braces (e.g., it is one line only) to prevent [errors](https://github.com/NYTimes/objective-c-style-guide/issues/26#issuecomment-22074256). These errors include adding a second line and expecting it to be part of the if-statement. Another, [even more dangerous defect](http://programmers.stackexchange.com/a/16530) may happen where the line "inside" the if-statement is commented out, and the next line unwittingly becomes part of the if-statement. In addition, this style is more consistent with all other conditionals, and therefore more easily scannable.

**For example:**
{% highlight objective-c %}
if (!error) {
    return success;
}
{% endhighlight %}

**Not:**
{% highlight objective-c %}
if (!error)
    return success;
{% endhighlight %}

or

{% highlight objective-c %}
if (!error) return success;
{% endhighlight %}

## Ternary Operator

The Ternary operator, ? , should only be used when it increases clarity or code neatness. A single condition is usually all that should be evaluated. Evaluating multiple conditions is usually more understandable as an if statement, or refactored into instance variables.

**For example:**
{% highlight objective-c %}
result = a > b ? x : y;
{% endhighlight %}

**Not:**
{% highlight objective-c %}
result = a > b ? x = c > d ? c : d : y;
{% endhighlight %}

# Error handling

When methods return an error parameter by reference, switch on the returned value, not the error variable.

**For example:**
{% highlight objective-c %}
NSError *error;
if (![self trySomethingWithError:&error]) {
    // Handle Error
}
{% endhighlight %}

**Not:**
{% highlight objective-c %}
NSError *error;
[self trySomethingWithError:&error];
if (error) {
    // Handle Error
}
{% endhighlight %}

Some of Apple’s APIs write garbage values to the error parameter (if non-NULL) in successful cases, so switching on the error can cause false negatives (and subsequently crash).

# Methods

In method signatures, there should be a space after the scope (-/+ symbol). There should be a space between the method segments.

**For Example**:
{% highlight objective-c %}
- (void)setExampleText:(NSString *)text image:(UIImage *)image;
{% endhighlight %}
# Variables

Variables should be named as descriptively as possible. Single letter variable names should be avoided except in `for()` loops.

Asterisks indicating pointers belong with the variable, e.g., `NSString *text` not `NSString* text` or `NSString * text`, except in the case of constants.

Property definitions should be used in place of naked instance variables whenever possible. Direct instance variable access should be avoided except in initializer methods (`init`, `initWithCoder:`, etc…), `dealloc` methods and within custom setters and getters. For more information on using Accessor Methods in Initializer Methods and dealloc, see [here](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/MemoryMgmt/Articles/mmPractical.html#//apple_ref/doc/uid/TP40004447-SW6).

**For example:**

{% highlight objective-c %}
@interface NYTSection: NSObject

@property (nonatomic) NSString *headline;

@end
{% endhighlight %}

**Not:**

{% highlight objective-c %}
@interface NYTSection : NSObject {
    NSString *headline;
}
{% endhighlight %}

# Naming

Apple naming conventions should be adhered to wherever possible, especially those related to [memory management rules](https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/MemoryMgmt/Articles/MemoryMgmt.html) ([NARC](http://stackoverflow.com/a/2865194/340508)).

Long, descriptive method and variable names are good.

**For example:**

{% highlight objective-c %}
UIButton *settingsButton;
{% endhighlight %}

**Not**

{% highlight objective-c %}
UIButton *setBut;
{% endhighlight %}

A three letter prefix (e.g. `NYT`) should always be used for class names and constants, however may be omitted for Core Data entity names. Constants should be camel-case with all words capitalized and prefixed by the related class name for clarity.

**For example:**

{% highlight objective-c %}
static const NSTimeInterval NYTArticleViewControllerNavigationFadeAnimationDuration = 0.3;
{% endhighlight %}

**Not:**

{% highlight objective-c %}
static const NSTimeInterval fadetime = 1.7;
{% endhighlight %}

Properties should be camel-case with the leading word being lowercase. **If Xcode can automatically synthesize the variable, then let it.** Otherwise, in order to be consistent, the backing instance variables for these properties should be camel-case with the leading word being lowercase and a leading underscore. This is the same format as Xcode's default synthesis.

**For example:**

{% highlight objective-c %}
@synthesize descriptiveVariableName = _descriptiveVariableName;
{% endhighlight %}

**Not:**

{% highlight objective-c %}
id varnm;
{% endhighlight %}

## Underscores

When using properties, instance variables should always be accessed and mutated using `self.`. This means that all properties will be visually distinct, as they will all be prefaced with `self.`. Local variables should not contain underscores.

# Image Naming

See the [Invoke Labs Design Standards Document](https://docs.google.com/a/invokelabs.com/viewer?a=v&pid=sites&srcid=aW52b2tlbGFicy5jb218aGFuZGJvb2t8Z3g6MzNjZmVhNmRjNmNkMTk0YQ)

# Booleans

Since `nil` resolves to `NO` it is unnecessary to compare it in conditions. Never compare something directly to `YES`, because `YES` is defined to 1 and a `BOOL` can be up to 8 bits.

This allows for more consistency across files and greater visual clarity.

**For example:**

{% highlight objective-c %}
if (!someObject) {
}
{% endhighlight %}

**Not:**

{% highlight objective-c %}
if (someObject == nil) {
}
{% endhighlight %}

-----

**For a `BOOL`, here are two examples:**

{% highlight objective-c %}
if (isAwesome)
if (![someObject boolValue])
{% endhighlight %}

**Not:**

{% highlight objective-c %}
if ([someObject boolValue] == NO)
if (isAwesome == YES) // Never do this.
{% endhighlight %}

-----

If the name of a `BOOL` property is expressed as an adjective, the property can omit the “is” prefix but specifies the conventional name for the get accessor, for example:

{% highlight objective-c %}
@property (assign, getter=isEditable) BOOL editable;
{% endhighlight %}
Text and example taken from the [Cocoa Naming Guidelines](https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/CodingGuidelines/Articles/NamingIvarsAndTypes.html#//apple_ref/doc/uid/20001284-BAJGIIJE).

# Singletons

Singleton objects should use a thread-safe pattern for creating their shared instance.
{% highlight objective-c %}
+ (instancetype)sharedInstance {
   static id sharedInstance = nil;

   static dispatch_once_t onceToken;
   dispatch_once(&onceToken, ^{
      sharedInstance = [[self alloc] init];
   });

   return sharedInstance;
}
{% endhighlight %}
This will prevent [possible and sometimes prolific crashes](http://cocoasamurai.blogspot.com/2011/04/singletons-your-doing-them-wrong.html).