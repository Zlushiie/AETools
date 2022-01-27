# AETools Discord Bot

Utility made for Anime Empire's Treasury Team.

1. [Treasury](#treasury)
	1. [Shorthands](#shorthands)
		1. [Relics](#relics)
		2. [Soup Store](#soup-store)
	2. [Queries](#queries)
		1. [Relics](#relics1)
		2. [Relic Tags](#relic-tags)
		3. [Prime Sets](#prime-sets)
		4. [Prime Parts](#prime-parts)
		5. [Colors](#colors)
	3. [Commands](#commands)
	    1. [Hosting](#hosting)
	    2. [Reputation](#reputation)
	    3. [Soup](#soup)
2. [Farmers](#farmers)
	1. [Queries](#queries1)
		1. [Kingdoms](#kingdoms)
		2. [Resources](#resources)
	2. [Commands](#commands1)
	    1. [Hosting](#hosting1)
3. [Resources](#resources)

You can use always use the command `++Help` to direct people to this page.

> *Capitalization DOES NOT MATTER AT ALL when using the bot.*
<br/>*The database for AETool updates every 3 minutes.*

## Treasury

### Shorthands

#### Relics

Relic shorthands are in the format `{First Name of Era}{Relic Tag}`.

>`Axi L4 -> AL4`
<br/>`Neo N16 -> NN16`
<br/>`Meso L2 -> ML2`
<br/>`Lith H3 -> LH3`

#### Soup Store

Soup store shorthands are in the format of `{Count}{Relic Shorthand}`.

>`60x Axi L4 -> 60AL4`
<br/>`45x Neo N16 -> 45NN16`
<br/>`30x Meso L2 -> 30ML2`
<br/>`15x Lith H3 -> 15LH3`
<br/>Total: `60AL4 45NN16 30ML2 15LH3`

### Queries

You can query prime parts, prime sets, and relics using AETools.
<br/> If you prefer not to use a prefix, for more efficient querying, you can DM AETools queries, without a prefix

<div id="relics1"></div>

#### Relics
You can query relics with either their full name `Lith H3` or their [shorthand](#relics), `LH3`.

The title of the reply is in the format
<br/>`[Relic Name] {Vault Status} {Tokens} Update Introduced`

While the body is in the format
```
Part 1 Rarity │ Part 1 Count │ Part 1
Part 2 Rarity │ Part 2 Count │ Part 2
Part 3 Rarity │ Part 3 Count │ Part 3
Part 4 Rarity │ Part 4 Count │ Part 4
Part 5 Rarity │ Part 5 Count │ Part 5
Part 6 Rarity │ Part 6 Count │ Part 6
```
For part rarity, C = common, UC = uncommon, RA = Rare

#### Relic Tags
You can query relic tags such as `N1` or `L4`.

In the case that there is only 1 relic with the given tag, it will just send an embed of that relic.

#### Prime Sets
You can query prime sets such as `Volt Prime` or `Kronen Prime`.

SPECIAL USE CASES: `Kavasa Prime Collar` and `Silva and Aegis Prime`

#### Prime Parts
You can query prime parts such as `Volt Prime Neuroptics` or `Kronen Prime Blade`.

SPECIAL USE CASES: `Venka Prime Blade`

#### Colors
You can query colors such as `ED` or `Red` to show all parts with the given color.

### Commands

#### Hosting
You can host squads for running relics using the hosting commands (`++Host`, `++Prehost`, and `++Bois`).

Host commands are in the format `++HostCommand -relic count -relic`.

> `++Host -60 -AL4`
<br/>`++Prehost -45 -Neo N16`
<br/>`++Bois -30 -ML2`

#### Reputation
TreasuryTool's reputation is equal to the number of runs that you've participated in.

You can use `++Rep` or `++Rep @username` to check an individual user's reputation.

You can use `++Leaderboard` to see the users with the highest/lowest reputation.

#### Soup
You can format a list of relics into a soup store posting by `++{soup store shorthand}`, check out the shorthands [here](#soup-store).

## Farmers

<div id="queries1"></div>

### Queries

You can query kingdom resources, and singular resources using AETools.
<br/> If you prefer not to use a prefix, for more efficient querying, you can DM AETools queries, without a prefix

#### Kingdoms
You can query kingdoms with their abbreviation `AK | IK | HK | WK | YK | MK`.

#### Resources
You can query specific resources of a kingdom in the format `{kingdom abbreviation} {resources}`.

> `AK Ferrite`
<br/>`MK Alloy Plate`

<div id="commands1"></div>

### Commands

<div id="hosting1"></div>

#### Hosting
You can host squads for farming resources using the `++Host` command.

Host commands are in the format `++Host -node -resource -time in minutes -your role` where `your role` is one of: `khora, nekros, nova, wisp, leech, any`.

> `++Host -assur -plastids -60 -khora`
<br/>`++Host -mot -argon crystals -120 -leech`

## Resources

Relic info is scraped from the [Warframe Wiki](https://warframe.fandom.com/wiki/Void_Relic)
<br/>Treasury specific info is from [Google Sheets](https://docs.google.com/spreadsheets/d/14Lxib9u73S8lGJjbWrgiXXhfP3NFyzbH_aqh-gwMyn8/edit#gid=0).
