---
layout: default
title: Coding Practices
slug: coding_practices
base_url: "/"
---

# init and dealloc

`dealloc` methods should be placed at the top of the implementation, directly after the `@synthesize` and `@dynamic` statements. `init` should be placed directly below the `dealloc` methods of any class.

`init` methods should be structured like this:

{% highlight objective-c %}
- (instancetype)init {
    self = [super init]; // or call the designated initalizer
    if (self) {
        // Custom initialization
    }

    return self;
}
{% endhighlight %}

# Class Layout

## Imports

When it comes to imports, header files should always be **minimal** and **complete**. "Minimal" just means a header file should import no more than it needs. "Complete" means the header file imports everything that is needed to compile it. In your headers you should only import:

* The class you are subclassing.
* Any protocols you implement.
* Any constants you depend upon.

Classes that are only referenced in your interface should be forward declared with the @class directive.

In your implementation file, always include yourself first. Then start with specific classes, and work your way down to entire frameworks.

See the following articles for more information:

* http://qualitycoding.org/import-order/
* http://qualitycoding.org/file-dependencies/

## Pragma Marks

Pragma marks should be used in your class implementation to separate key areas of code:

* Dealloc, Initializers
* Properties
* Each Superclass where you override methods (e.g. NSObject, UIViewController)
* Public methods
* Each Protocol that you conform to (e.g. NSCoding, UITableViewDataSource)
* Private methods
* Class methods

# Literals

`NSString`, `NSDictionary`, `NSArray`, and `NSNumber` literals should be used whenever creating immutable instances of those objects. Pay special care that `nil` values not be passed into `NSArray` and `NSDictionary` literals, as this will cause a crash.

**For example:**

{% highlight objective-c %}
NSArray *names = @[@"Brian", @"Matt", @"Chris", @"Alex", @"Steve", @"Paul"];
NSDictionary *productManagers = @{@"iPhone" : @"Kate", @"iPad" : @"Kamal", @"Mobile Web" : @"Bill"};
NSNumber *shouldUseLiterals = @YES;
NSNumber *buildingZIPCode = @10018;
{% endhighlight %}

**Not:**

{% highlight objective-c %}
NSArray *names = [NSArray arrayWithObjects:@"Brian", @"Matt", @"Chris", @"Alex", @"Steve", @"Paul", nil];
NSDictionary *productManagers = [NSDictionary dictionaryWithObjectsAndKeys: @"Kate", @"iPhone", @"Kamal", @"iPad", @"Bill", @"Mobile Web", nil];
NSNumber *shouldUseLiterals = [NSNumber numberWithBool:YES];
NSNumber *buildingZIPCode = [NSNumber numberWithInteger:10018];
{% endhighlight %}

# CGRect Functions

When accessing the `x`, `y`, `width`, or `height` of a `CGRect`, always use the [`CGGeometry` functions](http://developer.apple.com/library/ios/#documentation/graphicsimaging/reference/CGGeometry/Reference/reference.html) instead of direct struct member access. From Apple's `CGGeometry` reference:

> All functions described in this reference that take CGRect data structures as inputs implicitly standardize those rectangles before calculating their results. For this reason, your applications should avoid directly reading and writing the data stored in the CGRect data structure. Instead, use the functions described here to manipulate rectangles and to retrieve their characteristics.

**For example:**

{% highlight objective-c %}
CGRect frame = self.view.frame;

CGFloat x = CGRectGetMinX(frame);
CGFloat y = CGRectGetMinY(frame);
CGFloat width = CGRectGetWidth(frame);
CGFloat height = CGRectGetHeight(frame);
{% endhighlight %}

**Not:**

{% highlight objective-c %}
CGRect frame = self.view.frame;

CGFloat x = frame.origin.x;
CGFloat y = frame.origin.y;
CGFloat width = frame.size.width;
CGFloat height = frame.size.height;
{% endhighlight %}

# Constants

Constants are preferred over in-line string literals or numbers, as they allow for easy reproduction of commonly used variables and can be quickly changed without the need for find and replace. Constants should be declared as `static` constants and not `#define`s unless explicitly being used as a macro.

**For example:**

{% highlight objective-c %}
static NSString * const NYTAboutViewControllerCompanyName = @"The New York Times Company";

static const CGFloat NYTImageThumbnailHeight = 50.0;
{% endhighlight %}

**Not:**

{% highlight objective-c %}
#define CompanyName @"The New York Times Company"

#define thumbnailHeight 2
{% endhighlight %}

# Enumerated Types

When using `enum`s, it is recommended to use the new fixed underlying type specification because it has stronger type checking and code completion. The SDK now includes a macro to facilitate and encourage use of fixed underlying types — `NS_ENUM()`

**Example:**

{% highlight objective-c %}
typedef NS_ENUM(NSInteger, NYTAdRequestState) {
    NYTAdRequestStateInactive,
    NYTAdRequestStateLoading
};
{% endhighlight %}

# Private Properties

Private properties should be declared in class extensions (anonymous categories) in the implementation file of a class. Named categories (such as `NYTPrivate` or `private`) should never be used unless extending another class.

**For example:**

{% highlight objective-c %}
@interface NYTAdvertisement ()

@property (nonatomic, strong) GADBannerView *googleAdView;
@property (nonatomic, strong) ADBannerView *iAdView;
@property (nonatomic, strong) UIWebView *adXWebView;

@end
{% endhighlight %}

# Blocks

Blocks are a powerful language feature, but one that can quickly become difficult to manage. You should try to:

* Forward declare longer blocks
* Avoid nesting blocks
* Use the **__weak** compiler directive to avoid strongly referencing variables such as 'self'

**For Example**

{% highlight objective-c %}
	__weak IVLViewController *weakSelf = self;

	void (^hideAnimations)() = ^() {
		weakSelf.subviewA.alpha = 0.0;
		weakSelf.subviewB.alpha = 0.0;
		weakSelf.subviewC.alpha = 1.0;
		weakSelf.subviewC.center = CGPointZero;
	};
	
	void (^completionHandler)(BOOL finished) = ^(BOOL finished) {
		if (finished) {
			[weakSelf.subviewA removeFromSuperview];
			[weakSelf.subviewB removeFromSuperview];
		}
	};
	
	[UIView animateWithDuration:duration animations:hideAnimations completion:completionHandler];
{% endhighlight %}

**NOT**

{% highlight objective-c %}
	__weak IVLViewController *weakSelf = self;
	
	[UIView animateWithDuration:duration animations:^{
		weakSelf.subviewA.alpha = 0.0;
		weakSelf.subviewB.alpha = 0.0;
		weakSelf.subviewC.alpha = 1.0;
		weakSelf.subviewC.center = CGPointZero;
	} completion:^(BOOL finished) {
		if (finished) {
			[weakSelf.subviewA removeFromSuperview];
			[weakSelf.subviewB removeFromSuperview];
		}
	}];
{% endhighlight %}

* Avoid the **Block Monster** at all costs!

