const dashboardRepository = require('../module/dashboard-setting/repository')


const loadDashboardSettings = async () => {
  if (DASHBOARD_ADMIN_CONFIG.setupPassed)
    return

  let settings = await dashboardRepository.getRecords()
  if (!settings.length)
    return

  for (let setting of settings) {
    if (setting.dashboard_setting_key === 'setting_page_title')
      DASHBOARD_ADMIN_CONFIG.dashboardTitle = setting.dashboard_setting_value
    if (setting.dashboard_setting_key === 'setting_items_peer_page')
      DASHBOARD_ADMIN_CONFIG.MAX_PAGES_BY_REQUEST = setting.dashboard_setting_value
  }
  DASHBOARD_ADMIN_CONFIG.setupPassed = true
}

const DASHBOARD_ADMIN_CONFIG = {
  MAX_PAGES_BY_REQUEST: 60,
  IMAGE_SIZES: [
    [600, 200],
    [150, 150],
  ],
  dashboardTitle: 'webcms',
  setupPassed: false,
  loadDashboardSettings,
}

DASHBOARD_ADMIN_CONFIG.loadDashboardSettings()

module.exports = DASHBOARD_ADMIN_CONFIG
