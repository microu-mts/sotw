Concepts
--------

`stag` for style tags 
`vtag` for variant tag

stag structure
--------------
part0/part1/part2:state0:state1


Component side
--------------
* stags are used by component implmeentation
* component implementation provide a way for component user to define vtags

Styler
------

A styler is a function taking stags and vtags as arguments an freturning a list of class names (e.g. twaildind classes) 

SVTStyler
---------
An `SVTStyler` is defined by:
* a liste of rules
* a normalizer

An `SVTStylerRule` is defined by
* a matcher: (stags, vtags)=>boolean
* an action: (class:string[]) => string[]

Behavior of an SVTSyler:
* For a given (stags, vtags)
* start with an empty class list
* apply action of rach rule that matches in order to class list.
* apply the normalizer (e.g. twMerge) to class list
* return class list


Basic SVTStylerRule
-------------------
{
    stagMode: "one"| "all"| "any";
    stag: string[]| undefined;
    vtagMode: "one"| "all"| "any";
    vtag: string[]| undefined;
    classes: string[]
}

A rule Matches if following conditions are true:

* rule.stagMode is "any" OR 
    - stagMode is "one" AND intersection of rule.stag and stag is not empty
    - stagMode is "all" AND intersection of rule.stag and stag is rule.stag

* rule.vtagMode is undefined OR instersection of rule.vtag and vtag is not empty
    - vtagMode is "one" AND intersection of rule.vtag and vtag is not empty
    - vtagMode is "all" AND intersection of rule.vtag and vtag is rule.stag

Action:
    add rule.classes to class list
