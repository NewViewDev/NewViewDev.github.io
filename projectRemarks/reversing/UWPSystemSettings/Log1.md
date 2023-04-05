---
layout: default
title: UWP System Settings Reversing
---

# UWP System Settings Reversing

Last Edited: {{ site.time | date: "%B %d, %Y" }}

<!-- [**Project Link**] -->

## Introduction:
This is my first reverse engineering project. I always wanted to take a reversing class in college, but it always ended up full or during a filled slot in my schedule. Anyways, before this project, I didn't have any real reversing experience so this has been more of a learning experience than anything else.

The inspiration for this project comes from wanting to add some custom capability to the windows settings application. I know that it would have been much simpler to write my own basic program instead of reversing the source code of someone else's, but with the stubbornness of not wanting another application in my system tray, combined with the desire to learn, I chose this route.

## The Idea:
I wanted there to be a little check box or lock symbol in the volume mixer to enable relative volume adjustment. Basically, I wanted to be able to lock the focused program's volume where it is, while lowering or raising all of the others.
<image src="./Concept.png" alt="Rough Concept"/> 

Couldn't I just open the volume mixer every time, increase the master adjustment, then lower or raise the focused program's volume after?  Don't you only need to do this rarely? Why write a whole program?
Those are all fair questions, and my excuses are:
- The perceived annoyance of alt tabbing out of a game to change sound settings was annoying me one specific night
- I thought this would be a useful set of skills to have
- If I get efficient at modifying windows applications I'll probably tweak all sorts of things, maybe even making automation tools to make it trivial

## Starting off:
The two reversing tools I already had on my laptop were [Ghidra](https://github.com/NationalSecurityAgency/ghidra) and [Cheat Engine](https://github.com/cheat-engine/cheat-engine). I had experimented with both once or twice, but never did anything worthwhile. I'll also say that I'm not sure how commonly used Cheat Engine is, but it's a tool to search for specific values in a programs memory at runtime. Additionally, if I remember correctly, the precompiled installer contains adware offers, so be careful when installing.

Using Cheat Engine, I attempted to track down a boolean value for the mute button. After a while of searching, I managed to find multiple memory addresses that seemed to relate to muting and un-muting in one way or another.
<image src="./CheatEngine.png" alt="Cheat Engine"/> 
I then used CheatEngine to view what functions were making these changes to memory. I forget all of them, but the one that seemed like it was most important to modifying the UI was Windows.UI.Xaml.dll.

Based on that, I decided to try and find where the settings file was calling a function provided by this dll. I got the relative offset to the System Settings base memory address, and went to that location in Ghidra. Sadly, I didn't find anything that made much sense to me there. I plan to go back and try to figure out why, but I couldn't find the reference that I was expecting to discover.

Looking back, I realize that I probably should have kept trying to make this piece of the puzzle make sense. It's possible I made an error in obtaining the memory location. However, I instead began to do research about the Windows.UI.Xaml.dll file. I couldn't find too much information about the dll specifically, but there was plenty of information referencing [UWP XAML](https://learn.microsoft.com/en-us/windows/uwp/xaml-platform/) apps and the [WinUI library](https://learn.microsoft.com/en-us/windows/apps/winui/).

## Lots and lots of research:
From here I continued my reading into UWP applications, which was confusing to say the least. At this point, I've pretty much come to the conclusion that a UWP application can be [whatever we want it to be](https://www.windowscentral.com/what-makes-uwp). There is no great definition, and as long as a program uses some modern UWP libraries, it's a UWP program. I get that moving away from the win32 standard is a lot of work, but I really do wish the distinction was written in plaintext somewhere instead of leaving me to surmise this from a number of sources.

Anyways, rant aside, I now knew I was dealing with a UWP application, which sounded like it would use probably the .NET framework. With this newfound development, I started to realize that Ghidra might not be too much help. My very minimal understanding of the .NET framework is that it's similar to Java in that all programs are compiled for a .NET virtual machine. Would this make reading the assembly any more difficult?

I was off to google to find the answer to my question. I quickly found people listing [dnSpy](https://github.com/dnSpy/dnSpy) as the right tool for the job. I opened System Settings in dnSpy, and founddddd... Nothing useful? It didn't seem to tell me anything new. Was I not dealing with a .NET executable? I now realized I needed a way to confirm or deny that this was a .NET program or not. I don't remember exactly what I did, but I believe I ran a command to see if the .NET library was loaded in the System Settings program while it was running.

<image src="./dnSpy.png" alt="Nothing new"/> 
Though if you have experience, you'll probably be shaking your head, because I believe both Ghidra and dnSpy should have said .NET when I loaded the file instead of PE. I however did not know that at the time and had a learning experience.

## A short break:
By now I was somewhat frustrated, and I had tons and tons of reversing tabs and tutorials up. In the process I had come across a number of tools that looked interesting. Even though they did not directly relate to my task at hand, they seemed like some cool new toys to play with, and I was hoping I'd come across something useful to aid in my task.

#### On my excursion, I added the following tools to my collection:
- [de4dot](https://github.com/de4dot/de4dot)
- [Fiddler](https://www.telerik.com/download/fiddler)
- [Luke StackWalker](https://lukestackwalker.sourceforge.net/)
- [PE Detective](https://ntcore.com/?page_id=367)
- [PEstudio](https://www.winitor.com/)
- [Procdot](https://www.procdot.com/) (I was already a big fan of procmon and I was ecstatic to find out this existed)
- [Process Hacker](https://processhacker.sourceforge.io/) (Though I now realize it has almost all the same features as ProcExplorer)
- Task Explorer II
- [x32/x64 dbg](https://x64dbg.com/)

I'm not saying I'm an expert with a single one. Instead, most of them I messed around with for 10ish minutes, said "That's pretty cool" and went onto the next one.

However, I did end up coming back to PEstudio, and x32/x64dbg to try and gain more information about SystemSettings or to step through the UI drawing. This was an educational process, but I still did not find exactly what I was looking for. Though maybe as I become more experienced with x64dbg, I'll be able to find what I'm looking for easier. I definitely plan to use both of these tools in the future, perhaps on what I would think of as a more standard executable.

## Back to Business:
Now I went back to reading more about UWP's and found information specifically related to the XAML that I saw in the Windows.UI.Xaml.dll file name. I quickly realized that it was [basically HTML](https://learn.microsoft.com/en-us/windows/uwp/xaml-platform/xaml-syntax-guide) for an executable, and read tons of documentation.

From this I gathered that there are typically [XBF files](https://learn.microsoft.com/en-us/uwp/api/windows.ui.xaml.markup.xamlbinarywriter?view=winrt-22621) that are compiled binary XAML files. This is understandably done to speed up runtime, but means that I can't just edit an XAML file like I was starting to hope.

<image src="./ImmersiveControlPanelFolder.png" alt="SystemSettings Folder"/> 

After looking in the System Settings directory, things got even worse. There wasn't a single XBF file, so what gives? Maybe in the appmanifest.xml file or the appxblockmap.xml? They sound like good places to store resource locations? Sadly, still no. I couldn't find any reason for the lack of XBF files in the documentation. As a result, I started using Process Explorer to check file handles and dlls as I was convinced I'd find the program opening an XBF file stored somewhere or another. Still no xbf files, but there were a few file types I had never seen before. A notable one was .mui

### [.mui files](https://learn.microsoft.com/en-us/windows/win32/intl/mui-resource-management)
After a little bit of googling, I wrote these files off as part of the translation of an app to another language. I said "I'm not really interested in that" and stopped my reading. However, I came back to the page a while later and discovered I shouldn't have written them off so easily.

The documentation explained the philosophy of writing applications that [pull their text data from another file](https://learn.microsoft.com/en-us/windows/win32/intl/mui-fundamental-concepts-explained). This way, instead of recompiling an application for every language, this file can just be edited by translators. This is useful for a variety of reasons such as bug reduction and corrections.

This suddenly made everything make sense as to why I was having no luck searching the executable for strings I was seeing within the program. The strings were never in the executable! Instead they were being pulled from somewhere else.

This seemed like a very good lead. I figured I might be able to look for how this data is pulled into the app, and use this to find the actual UI elements. However, I benched this theory temporarily, as I was now invested in discovering what other strange file types could tell me.

### [.pri file](https://learn.microsoft.com/en-us/windows/uwp/app-resources/pri-apis-custom-build-systems)
The main other file that seemed interesting from a quick google search was the .pri file. I found that microsoft offers a [tool](https://learn.microsoft.com/en-us/windows/uwp/app-resources/makepri-exe-command-options) to dump the contents of pri files, said "Wow, that was easy" and gave it a go. This process was very simple, and I was left with an xml file with a lot of data about the locations of resources! I was very excited and figured this would be the end of my reversing journey. However, I soon discovered that there was no reference to any XBF, XML, or XAML files. It was all just jpgs, pngs, and accompanying data. 

## So close, what now?
It finally occurred to me that maybe there was a simpler way to go about all of this. I saw tons of documentation on creating XAML UWP applications. I realized it may be a good idea to try creating a very simple one myself. After downloading the UWP Visual Studio component, I was in business. I created an XAML project, but one that was based on C++ instead of C#. I believe the C# options would have ended up as a .NET executable.
<image src="./origButton.png" alt="Simple Button"/> 
I made a very simple page, only containing one button. After compiling in debug mode, I found XBF files. I looked at them with a hex editor, and I was excited to find that the button text was saved within this file. I'm aware that this probably wouldn't be the case if I was using .mui files as discussed earlier, but it still seemed like a big discovery. I edited text within the XBF file and, sure enough, it changed in the app!
<image src="./editedButton.png" alt="Changed Button!"/> 
At this point I knew I was on the right trail, so I used [Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer) to find all .pri files in use by System Settings. There are a number of them spread out in different folders, but the one that contains mentions of an XBF file is located at: C:\Windows\SystemResources\Windows.UI.SettingsAppThreshold
<image src="./priLocation.png" alt="ProcExp Pri Location"/> 

This file is definitely a lot more complex than the simple one I had created myself. However, I can see within HxD that the XBF data is in the same format. It always starts with XBF, followed by a little bit of unknown data, followed by what may be a 256-bit checksum, followed by some documentation references, and the actual layout data. This definitely seems like the right place as a result, though it doesn't contain the program strings. I'm betting this has to do with the MUI files, but more research is needed.
<image src="./XBFFormat.png" alt=".pri decoded text"/> 

## Good place to reflect:
At this point I'm not sure the best way to go about this. I could compile many more simple programs and see how small changes affect the output pri file, or I could use ghidra and try to see how the compiler is parsing the XAML file into XBF. Or I could decompile the Windows.UI.Xaml.dll again now that I understand the idea of how everything is working together. This way I could hopefully understand how the XBF format is displayed.

I figured this was a good place to stop and write down the process I've taken and think about where to go next.
Seeing the proof of concept work, and feeling that I have an understanding of the underlying philosophies gives me confidence that I can figure out the rest in the near future. I'll be sure to make a second writeup concluding this project!