<script setup>
import sdkVersion from './.vitepress/sdk-version.json'

const sdkDownloadUrl = 'https://download.portal.battlefield.com/PortalSDK.zip'
const updatedAt = sdkVersion.fetchedAt
  ? new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeZone: 'UTC'
    }).format(new Date(sdkVersion.fetchedAt))
  : ''
</script>

# SDK Download

This page documents how to get the Portal SDK and shows the latest version available.

## Download the SDK

1. Go to [https://portal.battlefield.com/bf6/experiences](https://portal.battlefield.com/bf6/experiences)
2. Log in or create an account
3. Click **Download SDK**

Or download it directly below

## Current SDK Version

Version: **{{ sdkVersion.currentVersion || 'unavailable' }}**

<p>
  <a class="VPButton medium brand" :href="sdkDownloadUrl" target="_blank" rel="noreferrer">
    Download SDK
  </a>
</p>
<small v-if="sdkVersion.currentVersion && updatedAt">
  Last checked on: {{ updatedAt }}
  <p>
  * Newer versions may be available
  </p>
</small>
