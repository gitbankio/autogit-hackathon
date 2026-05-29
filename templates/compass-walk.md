---
title: Compass Walk
app_type: compass-walk
wallet: 0x033Cef61548E6920cBF16C0aB3937931258BFD02
---

You pick a point. The page draws a single line from your current position to that point, a compass needle pointing at it, the distance in meters, and the bearing in degrees. The page watches your phone's position and orientation while you walk and the line shrinks. When you arrive, a small notification fires and the screen stays awake. There is no map. There is no route. There is the line and the needle and a single number that says how far.

(I.)

A tea green page. Deep moss for body type. Terracotta for the bearing needle and the small target dot. Sky white for the inside of the big disc. Vollkorn at 18px 400 for body and 22px 500 for the distance number, the only place 22px appears. IBM Plex Sans at 13px 500 for the small labels and the buttons. Major Mono Display at 11px for the latitude longitude coordinates and the bearing degrees. Three typefaces, three roles, no overlap. The page is one column, the upper half is the disc, the lower half is the controls and readouts. The disc fills the viewport width minus 32px gutter and is always a perfect circle.

(II.)

The disc is one inline svg circle, deep moss outline 1px, sky white fill. Inside the disc, a single line drawn from the center to the rim, terracotta, 2px wide, rotated to the bearing from the visitor's current position to the chosen target. A small terracotta dot sits at the rim end of the line. A second hairline line from center to the rim points to true north and is labelled N in 11px Major Mono Display at thirty percent opacity. Three more compass labels E, S, W sit at the corresponding rim positions at twenty percent opacity. The disc is always upright relative to the page, the line and the needle rotate inside it.

The bearing rotation accounts for the visitor's device orientation. When the device exposes DeviceOrientationEvent with absolute true (an absolute heading), the disc rotates with the device so that the needle always points at the true direction of the target, the visitor reads the direction by looking down at the phone the way they would read a paper compass. When the device exposes only a relative orientation, the disc holds still and the needle rotates relative to a fixed north at the top, with a small italic 11px line below the disc reading this compass is not aligned to true north on this device.

(III.)

Below the disc, the readout block. The distance in 22px Vollkorn 500 deep moss, with the unit in 13px IBM Plex Sans 500 muted deep moss to the right, like 412 m or 1.4 km depending on the size. Below the distance, the bearing in 11px Major Mono Display deep moss, like bearing 064 deg. To the right of the bearing, the precision of the geolocation fix in the same font, like fix 6 m, with the number colored terracotta when the precision is worse than 25 meters. The block updates on every watchPosition callback, which the browser fires roughly every second or two on most devices.

Below the readout, a single row with three small text buttons in 13px IBM Plex Sans 500. The first reads pick a new target. Tapping it opens a small panel below the row with two inputs labelled latitude and longitude in decimal degrees, plus a small text button reading use this point, and a small subtle text button reading pick a place on the disc. The disc panel option puts the disc into a touch mode where the visitor drags the terracotta dot around the rim, the page interprets the rim position as a bearing, asks the visitor for an estimated distance in meters through a small slider from 50 to 5000, and computes the target latitude longitude from the visitor's current position. The math is a simple geodesic offset, accurate enough for walking distances.

The second button reads where am I, which simply blinks the visitor's current latitude longitude in the readout for 1200ms in 11px Major Mono Display terracotta.

The third button reads keep my screen on. Tapping it requests a screen wake lock through navigator.wakeLock.request with a type of screen. While the lock is held, the screen does not dim. The button text changes to let the screen sleep, tapping again releases the lock. If the wakeLock api is unavailable the button is omitted.

(IV.)

The page asks for geolocation permission on the first tap of pick a new target. Once granted, the App calls navigator.geolocation.watchPosition with enableHighAccuracy true, maximumAge 1000, timeout 8000. The shape of the options the App passes, written into src/lib/geo.ts.

```
{
  enableHighAccuracy: true,
  maximumAge:         1000,
  timeout:            8000
}
```

Every position update recomputes the distance to the target with the haversine formula, the bearing with the standard initial bearing formula, and updates the disc and the readout. A position with an accuracy worse than 50 meters dims the distance number to fifty percent opacity to remind the visitor that the number is approximate. A position that fails (the permission was denied or the gps lost signal) keeps the most recent reading on screen with a small italic 11px line reading the position fix went stale, in deep moss muted.

Device orientation is read through DeviceOrientationEvent listeners after a one tap permission request on iOS where the api requires a gesture. The webkitCompassHeading property is used when available (iOS), the alpha property is used otherwise (most android browsers), the bearing is converted to a clockwise from north heading and used to rotate the disc.

(V.)

A small block in the lower right corner shows the proximity threshold setting, a single slider from 10 to 200 meters with a tiny label arrival within. Default 25 meters. When the visitor is inside the threshold, the page fires a single notification through the Notification api with a title of arrived at the point and a body that reads the current bearing and a tiny note like you are inside the 25 meter circle. The notification options the App passes look like this.

```
{
  body:    'inside the 25 meter circle around the target',
  icon:    '/favicon.png',
  tag:     'compass.walk.arrival',
  requireInteraction: false
}
```

A second arrival event during the same walk does not refire (the tag prevents duplicates until the visitor leaves and returns). The wake lock is released on arrival, so the screen can dim again. Inside the disc, the line collapses to a dot at the center, the dot pulses in terracotta for 1200ms, and the disc fills with a faint terracotta wash that fades out over 800ms. The page does not navigate, does not announce, does not play sound. The visitor decides what to do next.

If the Notification api is unavailable or the visitor has not granted permission, the page falls back to a small in page banner across the top reading you have arrived, in 22px Vollkorn deep moss on a sky white band, that stays for 4 seconds.

(VI.)

The visitor's current target, the proximity threshold, and the latest accepted geolocation reading are saved to localStorage under the key compass.walk.v1 within 500ms of idle. On boot the App reads them, draws the disc with the last target in place, and starts watching position if a target exists. If localStorage is unavailable, the page falls back to memory and a small italic 11px line at the bottom of the page reads this walk is not being kept on this device. There is no walk history, the page is for the walk that is happening now.

The hairline circle at the rim of the disc is the only chrome on the disc. There is no map. There is no satellite tile. There is no place name lookup. The page deliberately does not know where the visitor is in human terms, it only knows the bearing and the meters. This is the whole posture of the page.

(VII.)

If geolocation is denied at the api level, the disc still draws but stays empty, the readouts show dashes, and a small italic 14px line under the disc reads this page needs the position permission to point at a target. A small text button below reads ask again, which retries the watchPosition call. If the device cannot expose orientation (a desktop browser), the disc still works, the rotation simply holds at north up.

A target whose distance exceeds 50 kilometers shows the distance in kilometers with one decimal place, and a small italic 11px line below the disc reads this target is far enough that the bearing changes very slowly. The page does not refuse long distance targets, it simply notes them.

A loss of signal mid walk does not erase the disc, the most recent reading stays visible until a new one arrives. The disc dims to seventy percent opacity while the reading is stale (older than 8 seconds), returns to full opacity on the next successful fix.

(VIII.)

The build is a single Vite project. React 18 with TypeScript. Tailwind CSS for layout and color, custom palette in tailwind.config.ts adding tea, moss, moss muted, terracotta, sky. Vite as the build tool. State is plain useState and one useReducer for the watch state and the arrival flag. No router, no global store, no context provider, no map library, no geolocation wrapper, no icon pack. navigator.geolocation, DeviceOrientationEvent, Notification, and navigator.wakeLock are all used directly. Every glyph including the small compass marks and the terracotta dot is inline svg in the component that uses it.

Files. index.html with the Vollkorn, IBM Plex Sans, and Major Mono Display links in the head. src/main.tsx as the React entry. src/App.tsx exporting one default component holding the watch id, the position, the orientation, the target, the threshold, and the arrival flag. src/components/Disc.tsx for the big circle and the rotating needle. src/components/Readout.tsx for the distance and bearing block. src/components/TargetPanel.tsx for the latitude longitude input and the drag mode. src/components/Controls.tsx for the three small text buttons. src/components/Threshold.tsx for the slider. src/lib/geo.ts for the watchPosition wrapper. src/lib/math.ts for the haversine and bearing helpers. src/lib/orientation.ts for the orientation listener and the heading conversion. src/lib/notify.ts for the Notification permission and the fire. src/lib/wake.ts for the wake lock. src/lib/storage.ts for the localStorage try catch. tailwind.config.ts. package.json with react, react dom, vite, tailwind only. README.md with two short paragraphs.

A first time visitor opens the page on a phone in their hand on a quiet street. The tea green page paints, the disc sits empty. They tap pick a new target, choose pick a place on the disc, drag the terracotta dot to the northeast, set the slider to 200 meters, tap use this point. The disc fills with a terracotta line pointing northeast, the distance reads 198 m, the bearing reads bearing 048 deg. They tap keep my screen on, accept the permission, and start walking. The line shortens. After a few blocks the disc fills with a terracotta wash, a notification appears, and the page reads arrived at the point. They put the phone away and look around.
