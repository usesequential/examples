# Install Sequential with Google Tag Manager

You can add Sequential to your site with Google Tag Manager (GTM). You do not need to change the code of your site. You paste the Sequential snippet into a **Custom HTML** tag, and GTM adds it to every page.

The snippet loads the Sequential SDK. The SDK sends analytics events and, when session replay is on for your project, it records sessions.

## Before you start

- You have a GTM web container on your site, and you can publish it.
- You have a Sequential project.
- You have the install snippet of the project. Open **Settings → Projects → your project → Setup**. The snippet there already contains your project key and your API host.

## The snippet

This is the snippet. The snippet on your **Setup** page is the same, but with your values in `data-key` and `data-api`.

```html
<!-- Sequential · analytics and session replay -->
<script>
(function(w){if(w.sequential)return;var q=[],s=w.sequential={_q:q},
m=['capture','identify','account','register','unregister','reset','optOut','optIn','captureException'];
for(var i=0;i<m.length;i++)(function(n){s[n]=function(){q.push([n,arguments])}})(m[i]);
s.flush=function(){q.push(['flush',arguments]);return typeof Promise=='function'?Promise.resolve():{then:function(f){if(f)f()}}}})(window);
</script>
<!-- Optional: add data-release="<your app version>" to the tag below to put the build on every event. -->
<script async src="https://cdn.usesequential.com/sdk/sequential/v1/sequential.js"
        data-key="sq_sequential_..."
        data-api="https://api.usesequential.com"></script>
```

| Attribute | Required | What it is |
|---|---|---|
| `data-key` | Yes | The project's Sequential ingest key. It starts with `sq_sequential_`. |
| `data-api` | Yes | The host that receives your events. On the hosted service, this is `https://api.usesequential.com`. |
| `data-release` | No | The version of your app. Sequential puts it on every event. |

There is no `init()` call. The SDK reads its settings only from these attributes on its `<script>` tag. Do not remove them, and do not move them to another tag.

The first `<script>` block is a small queue. If your site calls `sequential.capture(...)` or another method before the SDK loads, the queue keeps the call. The SDK runs the call when it loads. Keep this block above the second tag.

## Add the tag

1. In GTM, open your container and click **Tags → New**.
2. Name the tag, for example `Sequential`.
3. Click **Tag Configuration** and select **Custom HTML**.
4. Copy the snippet from your **Setup** page and paste it into the **HTML** field. Do not change it.
5. Leave **Support document.write** off. The snippet does not use `document.write`.
6. Open **Advanced Settings → Tag firing options** and select **Once per page**. A second copy of the SDK on the same page can send each event two times.
7. Click **Triggering** and select a trigger:
   - **Initialization - All Pages**. The tag fires before most other tags, so Sequential starts early on each page. Use this trigger if you do not need consent first.
   - **All Pages**. The tag fires on the page view. This is also correct.
   - If your site must get consent first, use a consent trigger in place of these. See [Fire the tag only after consent](#fire-the-tag-only-after-consent).
8. Click **Save**.

Use one trigger that fires once per page load. Do not add a **History Change** trigger for a single-page app. The SDK follows the navigation in your app by itself.

If your site already has the Sequential snippet in its HTML, do not add the GTM tag too. Use one of the two.

## Check the tag in Preview mode

1. In GTM, click **Preview**. Tag Assistant opens.
2. Type the address of your site and click **Connect**. Your site opens in a new window.
3. In Tag Assistant, select the first event in the list on the left. With **Initialization - All Pages**, this is **Initialization**. With **All Pages**, this is **Container Loaded**.
4. Make sure that the `Sequential` tag is under **Tags Fired**. If it is under **Tags Not Fired**, examine the trigger.
5. In the window of your site, open the developer tools of your browser.
6. Open **Console**. Look for lines that start with `[sequential]`:
   - "the script tag has no data-key" or a missing `data-api`: an attribute is missing. Copy the snippet from **Setup** again.
   - "data-release is not a release": the release value is not correct. See [Add your app version](#add-your-app-version).
7. Open **Network** and filter by your `data-api` host. Requests that get `200` or `204` are accepted. For each other status, see [Check your install](https://www.usesequential.com/docs/verify).

Preview mode sends real events to your project. Sequential stores them like events from any other visit.

## Check the install in Sequential

1. In Sequential, open **Settings → Projects → your project → Setup**.
2. Visit your site in a normal browser. You can use the Preview window. Sequential does not store visits from automated browsers.
3. Wait. The **Sequential** line changes from "no events yet" to "receiving". Events are written in batches, so this can take about a minute. **Session replay** can take up to about 7 minutes to show "receiving".

The **Setup** page checks for 5 minutes. If the line does not change, reload the page. If you are stuck, see [Check your install](https://www.usesequential.com/docs/verify).

## Publish the container

Preview mode does not change your live site. When the tag works, click **Submit** and then **Publish** in GTM.

## Add your app version

`data-release` puts the version of your app on every event. You can set it from a GTM variable.

1. Make the version available to GTM. For example, your site can push it to the data layer **before** the GTM container snippet:

   ```html
   <script>
     window.dataLayer = window.dataLayer || [];
     window.dataLayer.push({ appVersion: '2026.10.17-1' });
   </script>
   ```

2. In GTM, click **Variables → New**. Select **Data Layer Variable**. Set **Data Layer Variable Name** to `appVersion`. Name the variable `App Version` and save it. A **Constant** variable also works if you change it by hand for each release.
3. Open the `Sequential` tag. Add `data-release="{{App Version}}"` to the second `<script>` tag:

   ```html
   <script async src="https://cdn.usesequential.com/sdk/sequential/v1/sequential.js"
           data-key="sq_sequential_..."
           data-api="https://api.usesequential.com"
           data-release="{{App Version}}"></script>
   ```

4. Save the tag and check it in Preview mode.

GTM writes the value of the variable into the tag when the tag fires. The value must be 1 to 64 printable ASCII characters. If it is not, the SDK writes "data-release is not a release" in the console and sends events without a release. If the variable has no value, GTM writes `undefined`. The SDK treats `undefined`, `null`, `none` and `(null)` as no release, and sends events without one.

With **Initialization - All Pages**, the tag fires early. Push the version before the GTM container snippet, so the variable has a value when the tag fires.

## Fire the tag only after consent

Your site can ask visitors for consent before it loads analytics. In GTM, you control this with the trigger of the tag. Sequential does not decide which consent your site needs. This section shows only how to make the tag wait.

### Use the event of your consent tool

Most consent tools push an event to the data layer when the visitor makes a choice. The name of the event and of its variables depends on the tool. Read the documentation of your consent tool.

1. In GTM, click **Triggers → New**. Select **Custom Event**.
2. In **Event name**, type the event that your consent tool pushes when the visitor accepts.
3. If the tool pushes the same event for "accept" and "reject", select **Some Custom Events** and add a condition on the variable that holds the choice.
4. Save the trigger.
5. Open the `Sequential` tag. Remove **Initialization - All Pages** or **All Pages**, and add the new trigger. Keep **Once per page**.

Many consent tools push the event again on each page load when the visitor accepted before. If your tool does not, the tag fires only on the page where the visitor accepted. Check this in Preview mode: accept, then open a second page. The tag must be under **Tags Fired** on both pages.

### Use the consent settings of GTM

If your site uses Google consent mode, you can also add a consent check to the tag:

1. Open the `Sequential` tag.
2. Open **Advanced Settings → Consent Settings**.
3. Select **Require additional consent for tag to fire**, and add the consent type that your site uses for analytics, for example `analytics_storage`.

GTM then does not fire the tag while that consent is not granted. Use this check together with a trigger that fires after the visitor accepts, as above. Check in Preview mode that the tag fires after you accept, on the same page and on the next page.

### When a visitor withdraws consent

When the tag stops firing, the SDK does not load on the next pages. On the current page, the SDK is already loaded. To stop its events, call `sequential.optOut()`:

1. Click **Tags → New → Custom HTML**. Name it `Sequential opt out`.
2. Paste this:

   ```html
   <script>
     if (window.sequential) window.sequential.optOut();
   </script>
   ```

3. Add a trigger for the event that your consent tool pushes when the visitor withdraws consent.
4. Save the tag.

`optOut()` stops events and the session replay recording at once, and the browser remembers it. The SDK stays off in that browser, also on later visits, until your site calls `sequential.optIn()`.

### When the visitor accepts again

The browser remembers `optOut()`. So when the visitor accepts again, the `Sequential` tag fires, but the SDK stays off. Call `sequential.optIn()` after the `Sequential` tag:

1. Click **Tags → New → Custom HTML**. Name it `Sequential opt in`.
2. Paste this:

   ```html
   <script>
     if (window.sequential) window.sequential.optIn();
   </script>
   ```

3. Add the same consent trigger as the `Sequential` tag.
4. Open **Advanced Settings → Tag Sequencing**. Select **Fire a tag before Sequential opt in fires**, and select the `Sequential` tag. The first block of the snippet then exists when `optIn()` is called, and the SDK runs the call when it loads.
5. Save the tag.

Check this in Preview mode: accept, withdraw, reload, then accept again. Both tags must be under **Tags Fired**, and requests must go to your `data-api` host again.

A session replay recording that `optOut()` stopped stays stopped on that page. Recording starts again on the next page load after `optIn()`.

There is also a `data-opt-out` attribute. With it, the SDK starts each page load opted out, and your site must call `sequential.optIn()` on each page load after consent. If you control consent with the GTM trigger, you do not need it. See [Troubleshooting](https://www.usesequential.com/docs/troubleshooting).

This page is not legal advice. Ask your own adviser which consent your site needs. To learn what Sequential records, see [Privacy features](https://www.usesequential.com/privacy-features).

## Content Security Policy

If your site sends a `Content-Security-Policy` header:

- `script-src` must allow `https://cdn.usesequential.com` (the SDK, and the recording library that session replay uses) and your `data-api` host (the session replay recorder loads from it).
- `connect-src` must allow your `data-api` host (the events).
- GTM runs the first `<script>` block of the snippet as an inline script. Your policy must allow the inline scripts of GTM. Read the GTM documentation about CSP.

The **Content-Security-Policy** section of [Sequential SDK](https://www.usesequential.com/docs/sequential) lists the same hosts.

## Troubleshooting

| You see | Cause | Fix |
|---|---|---|
| The tag is under **Tags Not Fired** | The trigger did not fire. | Examine the trigger in Preview mode. With a consent trigger, accept first. |
| `[sequential] the script tag has no data-key` | The `data-key` attribute is missing or empty. | Copy the snippet from **Setup** again. |
| A missing `data-api` line in the console | The `data-api` attribute is missing. | Copy the snippet from **Setup** again. |
| Some events arrive two times | The SDK loaded two times on the page. | Set **Once per page**. Remove the snippet from your site HTML if GTM also adds it. |
| No events after `optOut()`, also after the visitor accepts again | The browser remembers `optOut()`. | Add the `Sequential opt in` tag. See [When the visitor accepts again](#when-the-visitor-accepts-again). |
| Other statuses in **Network** | See [Check your install](https://www.usesequential.com/docs/verify). | |

## Related

- [Install Sequential](https://www.usesequential.com/docs/install)
- [Sequential SDK](https://www.usesequential.com/docs/sequential)
- [Check your install](https://www.usesequential.com/docs/verify)
- [Session replay](https://www.usesequential.com/docs/session-replay)
- [Troubleshooting](https://www.usesequential.com/docs/troubleshooting)
- [Privacy features](https://www.usesequential.com/privacy-features)

Questions: hello@usesequential.com

## License

MIT. See [LICENSE](../LICENSE).
