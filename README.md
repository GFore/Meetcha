# Meetcha!

## Overview: 

Meetcha! is a responsive webApp that allows you to bypass Meetup's machine learning algorithm to populate what meetups you'd like to be apart of. Meetcha allows you to put in the zipcode of where ever you are or will be and it will give you a list of meetups in a given radius, of which you also get to choose. 

### Features: 

- Grabs initial current location
- Centers on given zipcode and provides a dynamic list that changes for every search
- Google markers allow you to click on the location and be given the title, date, and meetup URL
- Accordian style list to scroll through if the google map markers don't give you the information you're looking for

## Github Link: [Meetcha!](https://github.com/GFore/Meetcha)

## Team Members & Roles:
*Click on each member's name to see their GitHub profile*

All team members are students in the [Digital Crafts](https://www.digitalcrafts.com/) September 2018 cohort. This first project applied agile principles to get a MVP completed in a relatively short timeframe.

- [Greg Foreman](https://github.com/GFore)
- [Quinton Mills](https://github.com/quintonmills)
- [Kyle Sekellick](https://github.com/Kllicks)

## Tools and Technologies

**Languages:**
- HTML5
- CSS
- JavaScript

**API's**
- Google Maps JavaScript API for mapping meetup events
- Meetup API for a list of all events

## MVP (Minimum Viable Product):
- Initially center a map on a predetermined location
- Given a zipcode and radius provide a list of events
- Have those events pinned to the map
- When pins/markers are clicked have a dynamic div that populates with the events information
- Ability to reset search or resubmit a new search that clears the current one
- Responsive at different sizes

**Stretch Goals**
- Have pins/markers animate when hovering over the event in the list
- Make the list into an accordion
- Ability to search by more than just zipcode
- Stop pins/markers from stacking when at the same position

## Challenges & Solutions:
**Some of the biggest challenges we faced with this project build indluded:**

  1. **Challenge:** Google Maps API manipulation

    **Solution:** Google Maps API worked differently than any API we've already used. After reading through the Google Maps JavaScript API  documentation given it became more clear. However, most of the code samples were for very simple, specific tasks. Through quite a bit of research and rereading the documentation several times we were able to accomplish most of what we wanted to.

  2. **Challenge:** Styling

    **Solution:** Flexbox with different media queries is a difficult task to tackle. We were seeing behaviours that made no sense to us. We were able to power through and make constant small changes till we got the effect we wanted.

  3. **Challenge:** When to use as global variables

    **Solution:** When first create the flow of our project we didn't take into account what would need to be stored globally to be accessed later. This challenge wasn't much of a hurdle as we quickly realized as we ran into a coding wall that we needed to be passing more information to each function. 

## Screenshots or GIF