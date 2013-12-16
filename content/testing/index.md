---
layout: default
title: Testing via Appium, SauceLabs and the Testing Framework of your choice
slug: Appium/Sauce Testing
base_url: "/"
---

## Step 0: A brief overview

### What is Appium?

Appium, at its heart, is a way to avoid having to learn some testing specific language beyond what you already use to code. The whole premise is built on the notion that you can write your Automation Tests in the same language as you develop in and not have to waste time learning/using Xcode Instruments directly, which is actually a pretty solid idea. As I understand it, Appium is written on the back of the Selenium JSON wire protocol, so if you have any familiarity with that, this should be pretty easy. . . or at least similar.

### What is SauceLabs?

SauceLabs provides a service that allows users to carry out their testing in the cloud while still using their actual app and their own test code without any need for translation. In a nutshell, you upload a build of your app to their site and then point your tests to their servers at the location where your build is stored. They run the test on dedicated machines and keep track of all sorts of stats and stuff for you.

### What is the testing frame work of your choice?

Pretty wide open as long as you can properly integrate with the Appium/Selenium API protocols. Some popular choices seem to be:

1. **Cucumber**: a BDD based set up that uses Gherkin to generate scenario files, which you then use ruby to write tests for, which you then code in your Xcode project. Only works with Ruby, Java, .Net out of the box. . . you can use with other languages like Obj-C but that involves 4th party libraries like [this one](https://github.com/OCCukes/OCCukes) which I was never able to get going. Ruby is pretty straight forward though.

2. **PHPUnit**: I think this what the QA department is currently using for web automation testing so it makes sense to only have one testing language (thats the whole point of appium after all). With that in mind, they can write scripts for mobile (both android and ios) in exactly the same fashion that they write the scripts for web testing and use all the same commands, sauce communications, etc for everything. Of course, they could also implement all previous PHPUnit web tests in Cucumber with Ruby, but considering nothing has really been done on the mobile side yet, probably makes sense to go with the other.

3. **etc. . .**: this list could go on about J-Unit and other testing frameworks but not too much will be gained that isn't covered by the previous two. I think the testing framework choice is really just based on what the QAs/Devs are comfortable with.


## Step 1: Creating a build to Test 

Before you can start testing you need a valid project build that you want to run your tests against. The build has to be configured for iPhone exclusively and the easiest way to do this seems to be via the command line. 

1. Navigate to your project folder.

2. If you haven't done so already, open Xcode and install command line tools via `Xcode > Preferences > Downloads`. Then check the `Command Line Tools` box and wait till the download/install is complete.

3. When that is completed, run the following command `xcodebuild -sdk iphonesimulator6.0 TARGETED_DEVICE_FAMILY=1` inserting the desired simulator build according to your needs. If you are using cocoapods, you will need to compile using the workspace and this command instead: `xcodebuild -workspace YOURAPP.xcworkspace -sdk iphonesimulator7.0 TARGETED_DEVICE_FAMILY=1 -scheme YOURAPPPSCHEME`

4. There should now be a completed build at `YOUR-PROJECT-FOLDER/build/Release-iphonesimulator/YOURAPP.app` if you compiled your project however, you will need to grab the project build from something closer to this: `@/Users/InvokeLabs/Library/Application\ Support/iPhone\ Simulator/7.0/Applications/6EEE1E30-7223-4AC9-8CFC-58810048440C/`

5. Zip this file with the following command `zip -r YOURAPP.zip YOURAPP.app` and keep track of it. This is the packaged build of your app that SauceLabs will host and you will use to run your tests so make sure its good to go.

## Step 2: Uploading your build to SauceLabs

You will need a valid SauceLabs account for this. Invoke Labs should have one in which cause you should be using that `ClientID` and `ClientSecret`. For the remainder of these instructions I will assume your `ClientID` is `InvokeLabs`, your `ClientSecret` is `AAAA-AAAA-AAAA-AAAA`, and your app is called `YOURAPP.app`

1. Locate `.app.zip` build of you app from Setp 1 that you want to run tests against. From the command line modify and run the following: `curl -u InvokeLabs:AAAA-AAAA-AAAA-AAAA -X POST "http://saucelabs.com/rest/v1/storage/InvokeLabs/YOUR-APP.app.zip?overwrite=true" -H "Content-Type: application/octet-stream" --data-binary @/Users/wherever/you/saved/the/file/probably/in/build/Release-iphonesimulator/YOURAPP.app.zip`

2. You should get a JSON response in the command line to confirm that they have received the file and that it has content, etc. 

**note:** This is temporary storage and files are removed after 24 hours. Also note, that the `@` is crucial, if drop it, you do not receive an error but the actual file does not make its way to SauceLabs and you will be unhappy with yourself.

## Step 3: Creating a Test with the framework of your choice for Appium

Because we have to choose something, this particular demo is going to use Cucumber and Ruby/RSpec to generate the tests. If you don't have a testing framework/language in mind this is a pretty good choice. If you do have a framework in mind that is different than this, make sure you can hook it into the [Appium JSON Wire Protocol](https://github.com/appium/appium/wiki/JSON-Wire-Protocol:-Supported-Methods). Other than that, its pretty wide open in terms of what will work.

####a. Creating a Gherkin feature file

Cucumber uses the Gherkin Language to write its feature files. You can think of these feature files as sort of a blueprint for what you want to test for and what you want your code to do. These feature files are used in conjunction with the tests you will write but this actual code isn't compiled or really ran in any traditional sense. Details regarding Gherkin can be found [here](https://github.com/cucumber/cucumber/wiki/Gherkin).

1. Open (or create) the folder that your Xcode project folder lives in.

2. Create a file called titled `Gemfile` with following contents: `source "https://www.rubygems.org"
gem "rest-client"
gem "rspec"
gem "selenium-webdriver"
gem "cucumber"
gem "rspec-expectations"`

3. Run the following in command line:  `bundle install`. This creates a `Gemfile.lock` file in the current directory.

4. Create an additional folder titled `features` and in that folder, a file titled `YOURAPP.feature`

5. Populate the contents of your feature file with Gherkin syntax explaining the usage you expect of your app and its particular features. You will eventually parse these gherkin statements with regular expressions so keep that in mind to ensure that you can easily build in a variety of text entries or button pushes or whatever your app happens to do. To give you an idea of syntax and approach, below is a sample chunk of Gherkin for an App built on the `Master table view prototypee` that is intend to have a user add a new detail page, enter data on that page, save and have the new detail page appear in the master tableview:

{% highlight Gherkin %}
Feature: Notes
	As a iPhone user
	I want to YOURAPP app
	So that I can make note of everything happening in my life	

Scenario: Add new note
	Given I have App running with appium
	When click + button
	And I enter text "Data" and saved it
	Then I should see "Data" note added on home page
{% endhighlight %}

The Feature block is largely ignored, but you will link tests up to each scenario.

####b. Creating the Actual Tests

6. Now that we have a Gherkin blueprint set up, we can write the actual tests that implement it using Ruby/RSpec and the Appium - JSON wire Protocol. To do this we'll create a sub folder in `features` titled `StepDefinitions` and generate a `YOURAPPTEST.rb` file inside that folder. For this example, the contents of this file is written in Ruby and will map to what you outlined in your `.feature` file. Using the `.feature` file outlined above the corresponding code for a hypothetical  `Master table view prototypee` app would look something like this:

{% highlight ruby %}
Given(/^I have App running with appium$/) do  
	# Make sure you have started appium server  
end  

When(/^click \+ button$/) do  
sauce.find_element(:name, "Add").click  
end  


When(/^I enter text "(.*?)" and saved it$/) do |data|  
sauce.find_element(:xpath, "//window[1]/scrollview[1]/textview[1]").send_keys data  
sauce.find_element(:name, "Done").click  
sauce.find_element(:name, "Save").click  
end  


Then(/^I should see "(.*?)" note added on home page$/) do |text|  
note = sauce.find_element(:xpath,  "//window[1]/tableview[1]/cell[1]/text[1]")  
note.attribute("value").should match text  
end  
{% endhighlight %}

The code between the `when/then` and `@end` of each block can be thought of as replacing the javascript that you might have previously generated in Xcode Instruments. As a note, if you are into it, you can code this by hand, but Appium provides a recorder feature which takes the manual effort out of this a bit. Ill outline how that works below but feel free to skip ahead to the next instruction if the recorder isn't something you're going to use. Also, the `sauce` variable that you see in most of the statements is declared in a later file, it houses the specifics of the webdriver but we'll come to that.

>### Using the Appium Recorder (optional instruction)
>Much like the Instruments recorder, Appium records your interactions so that you don't actually have to code your tests. It is a good for generating example code or quick tests without bothering to learn the Appium JSON wire protocol.  
>1. Download Appium [here](http://appium.io/) and install and run it.  
>2. Select the `App Path` checkbox and locate a valid build of your app that you want to run automation tests against.  
>3. Select the `iOS` tab and the `Force Device: iPhone` if those choices are appropriate for you, then click `Launch`.  
>4. Click on the large `i` button to launch the recorder. This should boot up the Xcode simulator and launch a screen with a picture of your app and a variety of interaction buttons. If you select the `Record` option you can begin interacting with the app and the corresponding code will be >generated in the pop down window below. The test language can be toggled between `Obj-c` , `Ruby`, etc.  
>5. Copy and Paste this code into your test blocks as needed.  

#####c. Putting it all together

7. Finally, you need to create a file that ties together your app build that you uploaded to sauce, your tests that you've just written, and Appium. Do this by creating a new directory in `features` called `support` and a file in it called `environment.rb`. This file is going outline your `client ID` and `client Secret` for connecting to SauceLabs as well as a bunch of other stuff that Sauce specifies. . . basically all the important bits to make this work. 

	**A moment to visualize things**: At this point, if you were running your tests locally, you would set up this file to run on a version Appium that you downloaded (if you followed the Appium recorder instructions you will have what you need), and when you executed, your app would spin up in the simulator and all the tests you had written would carry out. On your command line, you would see the Gherkin text you had written gradually appearing and each line passing or failing based on whether or not your corresponding Ruby/Rspec tests passed. However, we are trying to get this running on sauce so we'll skip this part, but when we do connect this to sauce, this is essentially what will be happening, expect its going to go down on their computer instead of yours.

8. In accordance with SauceLabs [setup](https://saucelabs.com/appium/tutorial/2#setting-up-tests) you will need to include all of the following in your `environment.rb` file:

* A capabilities dictionary with the following key value pairs:

{% highlight ruby %}
def sauce_capabilities {  
'app' => 'sauce-storage:YOUAPP.zip',  
'device' => 'iPhone Simulator',  
'username' => 'Invokelabs',  
'access-key' => 'AAAA-AAAAA-AAAA-AAAA',  
'os' => 'iOS x'  
'platform' => 'OS X 10.8',  
'version' => '6.0',  
'name' => 'YOURAPP verison x.x.x'  
}end  
{% endhighlight %}

* you will also want to define your app url somewhere in the following format

{% highlight ruby %}
def sauce_url{  
"http://InvokeLabs:AAAA-AAAA-AAAA-AAAA@ondemand.saucelabs.com:80/wd/hub"  
}end  
{% endhighlight %}


* and finally define the Driver for sauce using these capabilities and the url you set up:

{% highlight ruby %}
def sauce{  
@sauce ||= Selenium::WebDriver.for(:remote, :desired_capabilities => sauce_capabilities, :url => sauce_url)  
}end

After { @sauce.quit}  
{% endhighlight %}

I'll include a sample so that you can see how this would all tie in, but the set up is pretty dependent on your situation and a bit finicky, this specific sample is for Cucumber using Gherkin similar to that above and Ruby/RSpec tests similar to those you saw above. For me, this was a trail and error process at best.

{% highlight ruby %}
require 'rspec/expectations'  
require 'selenium-webdriver'


APP_PATH = '/Users/scott.buchanan/Desktop/cucumber-appium/PlainNote/build/Release-iphonesimulator/PlainNote.app'

def sauce_capabilities
	{
		
		'app' => 'sauce-storage:YOURAPP.zip',
		'device' => 'iPhone Simulator',
		'username' => 'InvokeLabs',
		'access-key' => 'AAAA-AAAAA-AAAA-AAAA',
		'platform' => 'OS X 10.8',
		'version' => '6.0',
		'name' => 'Invoke Sauce Test',
		'passed' => 'true'
		
	}
end

def absolute_app_path
	File.join(File.dirname(__FILE__), APP_PATH)
end

def sauce_url
	"http://IvokeLabs:AAAA-AAAA-AAAA-AAAA@ondemand.saucelabs.com:80/wd/hub"
end

def sauce
	@sauce ||= Selenium::WebDriver.for(:remote, :desired_capabilities => sauce_capabilities, :url => sauce_url)
end

After { @sauce.quit }
{% endhighlight %}

##Step 4: Tying this all together

At this point all the pieces should be in place and you should be able to run a test that you have implemented on your app, as it exists on sauce labs.com. . .  this is a very exciting time. For our specific example we would execute the following command to run our cucumber test from the project folder 

`bundle exec cucumber features/YOURAPP.feature`

If this was successful you would see your Gherkin statements populating the command line and turning green or red as their correlating code from the Ruby/RSpec file passed or failed. When its all done you get a report about the outcome. . . but no simulator was running and there was no Appium window (that was all running on some computer at sauce labs). To view the actual play by play video of your tests and see a whole bunch of other stats and stuff go to this [link](https://saucelabs.com/tests).






