# Beach Day Tracker PRD

## Overview

Beach Day Tracker helps people in Hawaii decide if it is a good day to go to the beach. It uses real forecast data from the Open-Meteo Weather Forecast API and turns the weather into a simple beach rating.

API: https://open-meteo.com/en/docs

## Problem

During the summer, I often check the weather app before going to the beach. I want an app that answers the question: "Is today a good beach day?"

## Target User

Someone in Hawaii who wants a quick, simple way to check beach weather before making plans.

## Core Features

- Show current weather for a Hawaii beach location.
- Display temperature, feels-like temperature, rain chance, wind speed, and UV index.
- Give a simple rating: "Great," "Okay," or "Not ideal," based on rain chance, temperature, and wind.
- Show a short message with the rating, such as "Pack sunscreen" or "Maybe wait for better weather."
- Show a sunscreen/shade warning when the UV index is high.
- Let the user search only the saved beach list using a search bar.
- Let the user choose from a few suggested Hawaii beaches.
- Show loading and error messages when getting API data.

## Data Needed

Possible Open-Meteo fields:

- `current.temperature_2m`
- `current.apparent_temperature`
- `hourly.precipitation_probability`
- `hourly.wind_speed_10m`
- `hourly.uv_index`
- `current.weather_code`

## First Version

The first version should be one page with a beach search bar, suggested beach options, current weather summary, and beach day rating. The search bar should only filter saved beaches in the app. It should include Kailua Beach, Waikiki Beach, and North Shore, and fetch live data from Open-Meteo for right now only.

## Design Direction

The app should feel fun and beach-themed. It should use bright colors and a simple layout so the weather information is easy to read quickly.

## Rating Rules

A great beach day should have warm weather, low rain chance, and low wind. Temperature should be 75°F or warmer, rain chance above 30% should count as too rainy, and wind above 20 mph should count as too windy. High UV should not automatically make the beach rating worse, but the app should show a sunscreen/shade warning so the user knows to be careful.

If all main conditions are good, the app should show "Great." If conditions are close but not perfect, the app should show "Okay." If one or more conditions are bad, the app should show "Not ideal" and list the reasons, such as "too rainy," "too windy," or "too cold."
