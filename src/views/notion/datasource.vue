<template>
  <div class="neo-datasource-container">
    <aside class="neo-sidebar">
      <div class="sidebar-header">
        <h2 class="sidebar-title">工作区</h2>
      </div>

      <div class="sidebar-search-wrapper">
        <div class="capsule-search">
          <div class="search-inputs">
            <input
              v-model="workspaceSearchForm.workspaceName"
              type="text"
              placeholder="名称"
              @keyup.enter="handleWorkspaceSearch"
            />
            <div class="divider"></div>
            <input
              v-model="workspaceSearchForm.workspaceCode"
              type="text"
              placeholder="编码"
              @keyup.enter="handleWorkspaceSearch"
            />
          </div>
          <div class="search-actions">
            <button class="search-trigger" title="搜索" @click="handleWorkspaceSearch">
              <font-awesome-icon :icon="['fas', 'search']" />
            </button>
            <button class="search-trigger reset-btn" title="重置" @click="handleWorkspaceReset">
              <font-awesome-icon :icon="['fas', 'redo']" />
            </button>
          </div>
        </div>
      </div>

      <div class="sidebar-list-container">
        <a-spin :spinning="workspaceLoading">
          <div v-if="filteredWorkspaces.length > 0" class="neo-list">
            <div
              v-for="workspace in filteredWorkspaces"
              :key="workspace.id"
              class="neo-list-item workspace-list-item"
              :class="{ 'is-active': searchForm.workspaceId === workspace.id }"
              @click="selectWorkspace(workspace.id)"
            >
              <div class="item-prefix">
                <span class="workspace-mini-icon">
                  <img
                    v-if="isImage(workspace.icon)"
                    :src="workspace.icon"
                    alt=""
                    @error="handleImgError"
                  />
                  <span v-else-if="workspace.icon">{{ workspace.icon }}</span>
                  <font-awesome-icon v-else :icon="['fab', 'notion']" />
                </span>
              </div>

              <div class="item-content">
                <div class="item-title">{{ workspace.name || '未命名工作区' }}</div>
                <div class="item-subtitle">{{ workspace.code || '-' }}</div>
              </div>

              <div class="item-tail">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
              </div>
            </div>
          </div>

          <div v-else class="sidebar-empty-wrap">
            <div class="modern-empty-card mini">
              <div class="modern-empty-illus">
                <div class="mockup-window">
                  <div class="mockup-header">
                    <div class="mockup-dot"></div>
                    <div class="mockup-line short"></div>
                  </div>
                  <div class="mockup-row">
                    <div class="mockup-avatar"></div>
                    <div class="mockup-line"></div>
                  </div>
                </div>
              </div>
              <div class="modern-empty-content">
                <h4 class="modern-empty-title">{{ workspaces.length ? '未找到工作区' : '暂无工作区' }}</h4>
                <p class="modern-empty-desc">
                  {{ workspaces.length ? '请调整筛选条件' : '请先完成基础配置' }}
                </p>
                <button v-if="!workspaces.length" class="modern-empty-btn mini-btn" @click="goToConfig">
                  <font-awesome-icon :icon="['fas', 'arrow-right']" />
                  前往基础配置
                </button>
              </div>
            </div>
          </div>
        </a-spin>
      </div>

      <div class="sidebar-footer">
        <div class="custom-pagination">
          <button class="page-btn" disabled>
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
          </button>
          <div class="page-stats">本页 {{ filteredWorkspaces.length }} 条</div>
          <button class="page-btn" disabled>
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>
        </div>
      </div>
    </aside>

    <main class="neo-main">
      <div v-if="!activeWorkspace" class="neo-empty-state">
        <div class="modern-empty-card">
          <div class="modern-empty-illus">
            <div class="mockup-window">
              <div class="mockup-header">
                <div class="mockup-dot"></div>
                <div class="mockup-line short"></div>
              </div>
              <div class="mockup-row">
                <font-awesome-icon :icon="['fas', 'star']" class="mockup-star" />
                <div class="mockup-avatar"></div>
                <div class="mockup-line"></div>
              </div>
              <div class="mockup-row">
                <font-awesome-icon :icon="['fas', 'star']" class="mockup-star" />
                <div class="mockup-avatar"></div>
                <div class="mockup-line shorter"></div>
              </div>
            </div>
          </div>
          <div class="modern-empty-content">
            <h3 class="modern-empty-title">
              {{ workspaces.length > 0 ? '数据源管理中心' : '等待工作区配置' }}
            </h3>
            <p class="modern-empty-desc">
              {{
                workspaces.length > 0
                  ? '请在左侧选择一个工作区，\n以查看和管理其数据源与字段结构。'
                  : '完成基础配置后，\n这里会展示可同步的数据源。'
              }}
            </p>
            <button v-if="!workspaces.length" class="modern-empty-btn" @click="goToConfig">
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
              前往基础配置
            </button>
          </div>
        </div>
      </div>

      <div v-else class="neo-data-view fade-in">
        <header class="data-header">
          <div class="header-info">
            <div class="title-row">
              <h1>{{ activeWorkspace.name || '未命名工作区' }}</h1>
            </div>
            <p class="dict-remark">
              同步并查看当前工作区下的 Notion 数据源，字段结构可从右侧抽屉查看。
            </p>
          </div>
        </header>

        <div class="data-toolbar">
          <div class="capsule-search data-capsule">
            <div class="search-inputs">
              <input
                v-model="searchForm.title"
                type="text"
                placeholder="搜索数据源标题"
                @keyup.enter="handleSearch"
              />
            </div>
            <div class="search-actions">
              <button class="search-trigger" title="搜索" @click="handleSearch">
                <font-awesome-icon :icon="['fas', 'search']" />
              </button>
              <button class="search-trigger reset-btn" title="重置" @click="handleReset">
                <font-awesome-icon :icon="['fas', 'redo']" />
              </button>
            </div>
          </div>

          <div class="data-actions">
            <button
              v-if="canSyncDatasource"
              class="sync-action-btn"
              :disabled="syncing"
              title="同步数据源"
              @click="handleSync"
            >
              <font-awesome-icon :icon="['fas', syncing ? 'spinner' : 'rotate']" :class="{ spin: syncing }" />
              <span>{{ syncing ? '同步中' : '同步数据源' }}</span>
            </button>
            <button
              v-if="canDeleteDatasource && selectedRowKeys.length > 0"
              class="delete-action-btn"
              :disabled="deleteConfirmLoading"
              title="删除数据源"
              @click="confirmBatchDelete"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
              <span>删除 {{ selectedRowKeys.length }} 项</span>
            </button>
          </div>
        </div>

        <div class="data-table-wrapper neo-table-flex-container">
          <a-spin :spinning="loading" wrapperClassName="data-spin-wrap">
            <div v-if="tableData.length === 0" class="data-empty-container fade-in">
              <div class="modern-empty-card">
                <div class="modern-empty-illus">
                  <div class="mockup-window">
                    <div class="mockup-header">
                      <div class="mockup-dot"></div>
                      <div class="mockup-line short"></div>
                    </div>
                    <div class="mockup-row">
                      <font-awesome-icon :icon="['fas', 'database']" class="mockup-star" />
                      <div class="mockup-avatar"></div>
                      <div class="mockup-line"></div>
                    </div>
                    <div class="mockup-row">
                      <font-awesome-icon :icon="['fas', 'table-columns']" class="mockup-star" />
                      <div class="mockup-avatar"></div>
                      <div class="mockup-line shorter"></div>
                    </div>
                  </div>
                </div>
                <div class="modern-empty-content">
                  <h3 class="modern-empty-title">{{ loading ? '正在读取数据源' : '该工作区暂无数据源' }}</h3>
                  <p class="modern-empty-desc">
                    {{ loading ? '请稍候，正在读取 Notion 数据源。' : '点击同步按钮后，系统会读取当前工作区下的数据源。' }}
                  </p>
                  <button
                    v-if="canSyncDatasource && !loading"
                    class="modern-empty-btn"
                    :disabled="syncing"
                    @click="handleSync"
                  >
                    <font-awesome-icon :icon="['fas', syncing ? 'spinner' : 'rotate']" :class="{ spin: syncing }" />
                    同步数据源
                  </button>
                </div>
              </div>
            </div>

            <a-table
              v-else
              class="neo-table datasource-table"
              row-key="id"
              :columns="datasourceColumns"
              :data-source="tableData"
              :pagination="false"
              :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
              :scroll="{ x: 920 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'datasource'">
                  <div class="datasource-name-cell">
                    <span
                      class="datasource-avatar"
                      :class="{ 'icon-uploading': iconUploadingId === record.id }"
                      @click="triggerIconUpload(record)"
                    >
                      <span v-if="iconUploadingId === record.id" class="icon-upload-spinner">
                        <font-awesome-icon :icon="['fas', 'spinner']" spin />
                      </span>
                      <template v-else>
                        <img
                          v-if="isImage(record.icon)"
                          :src="record.icon"
                          alt=""
                          @error="handleImgError"
                        />
                        <span v-else-if="record.icon">{{ record.icon }}</span>
                        <font-awesome-icon v-else :icon="['fas', 'image']" />
                      </template>
                    </span>
                    <span class="datasource-copy">
                      <input
                        v-if="canEditDatasource && editingTitleId === record.id"
                        v-model="editingTitleValue"
                        class="inline-title-input"
                        :data-title-edit-id="record.id"
                        type="text"
                        maxlength="80"
                        @click.stop
                        @blur="handleTitleInputBlur(record)"
                        @keydown.enter.prevent="handleTitleEnter"
                        @keydown.esc.prevent="cancelInlineTitleEdit"
                      />
                      <button
                        v-else-if="canEditDatasource"
                        class="cell-title-edit"
                        type="button"
                        title="点击编辑标题"
                        @click.stop="startInlineTitleEdit(record)"
                      >
                        <span>{{ record.title || '未命名数据源' }}</span>
                        <font-awesome-icon :icon="['fas', 'pen']" />
                      </button>
                      <span v-else class="cell-label">{{ record.title || '未命名数据源' }}</span>
                      <span class="cell-muted">{{ record.workspaceName || activeWorkspace?.name || '-' }}</span>
                    </span>
                  </div>
                </template>

                <template v-else-if="column.key === 'datasourceId'">
                  <span class="mono-badge datasource-id-badge">{{ record.datasourceId || '-' }}</span>
                </template>

                <template v-else-if="column.key === 'updateTime'">
                  <span class="time-cell">{{ formatDateTime(record.updateTime || record.createTime) }}</span>
                </template>

                <template v-else-if="column.key === 'action'">
                  <div class="action-btn-group">
                    <button class="text-action-btn primary" @click="openProperties(record)">属性配置</button>
                  </div>
                </template>
              </template>
            </a-table>
          </a-spin>

          <div v-if="pagination.total > 0" class="datasource-pagination-bar">
            <a-pagination
              :current="pagination.current"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              :show-size-changer="pagination.showSizeChanger"
              :show-total="pagination.showTotal"
              @change="handlePageChange"
              @show-size-change="handlePageSizeChange"
            />
          </div>
        </div>
      </div>
    </main>

    <a-drawer
      v-if="currentDatasource"
      v-model:open="propertyDrawerVisible"
      class="datasource-property-drawer"
      placement="right"
      :width="560"
      :mask-style="{ background: 'rgba(0, 0, 0, 0.06)' }"
      :destroy-on-close="false"
      @close="cancelAddProperty"
    >
      <template #title>
        <div class="drawer-title">
          <span
            class="drawer-source-icon"
            :class="{ 'icon-uploading': iconUploadingId === currentDatasource?.id }"
            @click="triggerIconUpload(currentDatasource!)"
          >
            <span v-if="iconUploadingId === currentDatasource?.id" class="icon-upload-spinner">
              <font-awesome-icon :icon="['fas', 'spinner']" spin />
            </span>
            <template v-else>
              <img
                v-if="currentDatasource && isImage(drawerIcon)"
                :src="drawerIcon"
                alt=""
                @error="handleImgError"
              />
              <span v-else-if="drawerIcon">{{ drawerIcon }}</span>
              <font-awesome-icon v-else :icon="['fas', 'image']" />
            </template>
          </span>
          <span>
            <strong>{{ currentDatasource?.title || '未命名数据源' }}</strong>
            <small>{{ currentDatasource?.datasourceId || '-' }}</small>
          </span>
        </div>
      </template>

      <div class="drawer-content">
        <div v-if="currentDatasource" class="drawer-summary">
          <div class="summary-stat">
            <span class="summary-stat-value">{{ properties.length || 0 }}</span>
            <span class="summary-stat-label">字段数量</span>
          </div>
          <div class="summary-stat">
            <span class="summary-stat-value">{{ uniqueTypeCount }}</span>
            <span class="summary-stat-label">类型数量</span>
          </div>
        </div>

        <a-spin :spinning="propertyLoading" wrapperClassName="property-spin">
          <template v-if="properties.length > 0">
            <section class="property-config-card">
              <div class="property-config-separator"></div>

              <div class="property-list">
                <template v-for="(property, index) in properties" :key="property.propertyId">
                  <div
                    class="property-item"
                    :class="{ 'is-dragging': dragIndex === index, 'is-drag-over': dragOverIndex === index }"
                    draggable="true"
                    @dragstart="handleDragStart($event, index)"
                    @dragenter.prevent="handleDragEnter($event, index)"
                    @dragover.prevent
                    @dragleave="handleDragLeave($event, index)"
                    @drop="handleDrop($event, index)"
                    @dragend="handleDragEnd"
                  >
                    <span class="property-drag-handle" title="拖拽排序">
                      <font-awesome-icon :icon="['fas', 'grip-vertical']" />
                    </span>
                    <span class="property-type-icon" :style="getTypeColorStyle(property.propertyType)">
                      <font-awesome-icon :icon="getPropertyIcon(property.propertyType)" />
                    </span>
                    <span class="property-main">
                      <!-- 属性名称：编辑态 / 可点击态 / 只读态 -->
                      <input
                        v-if="canEditDatasource && editingNameId === property.propertyId"
                        v-model="editingPropertyName"
                        class="inline-title-input"
                        :data-prop-edit-id="property.propertyId"
                        type="text"
                        maxlength="80"
                        @click.stop
                        @blur="handleNameBlur(property)"
                        @keydown.enter.prevent="handlePropertyNameEnter"
                        @keydown.esc.prevent="cancelPropertyNameEdit"
                      />
                      <button
                        v-else-if="canEditDatasource"
                        class="cell-title-edit property-name-btn"
                        type="button"
                        title="点击编辑属性名"
                        @click.stop="startEditName(property)"
                      >
                        <span>{{ property.propertyName || '未命名字段' }}</span>
                        <font-awesome-icon :icon="['fas', 'pen']" />
                      </button>
                      <strong v-else>{{ property.propertyName || '未命名字段' }}</strong>
                      <!-- 属性类型：编辑态 / 可点击态 / 只读态（TITLE 不可修改） -->
                      <a-select
                        v-if="canEditDatasource && editingTypeId === property.propertyId && property.propertyType !== 'TITLE'"
                        v-model:value="editingPropertyType"
                        class="property-type-select"
                        dropdown-class-name="property-type-select-dropdown"
                        :bordered="false"
                        :show-search="true"
                        :filter-option="filterPropertyTypeOption"
                        :virtual="false"
                        placement="bottomLeft"
                        default-open
                        :get-popup-container="getPopupContainer"
                        @change="handleTypeChange(property)"
                        @click.stop
                      >
                        <a-select-option
                          v-for="(label, value) in options"
                          :key="value"
                          :value="value"
                        >{{ label }}</a-select-option>
                      </a-select>
                      <small
                        v-else-if="canEditDatasource && effectiveType(property) !== 'title'"
                        class="property-type-label is-editable"
                        title="点击编辑属性类型"
                        @click.stop="startEditType(property)"
                      >{{ getPropertyTypeLabel(effectiveType(property)) }}</small>
                      <small v-else>{{ getPropertyTypeLabel(effectiveType(property)) }}</small>
                    </span>
                    <button
                      v-if="INLINE_CONFIG_TYPES.has(effectiveType(property))"
                      class="property-option-btn"
                      :class="{ 'is-expanded': expandedPropertyId === property.propertyId }"
                      type="button"
                      @click.stop="togglePropertyExpand(property)"
                    >
                      {{ effectiveType(property) === 'unique_id' ? '前缀配置' : effectiveType(property) === 'relation' ? '关联配置' : '选项配置' }}
                    </button>
                    <button
                      v-if="canEditDatasource && property.propertyType !== 'TITLE'"
                      class="property-delete-btn"
                      type="button"
                      title="删除属性"
                      @click.stop="confirmPropertyDelete(property)"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                  <div v-if="expandedPropertyId === property.propertyId" class="property-options-expand">
                    <!-- unique_id：前缀配置 -->
                    <template v-if="effectiveType(property) === 'unique_id'">
                      <div class="prefix-config-row">
                        <span class="prefix-config-label">标识符前缀</span>
                        <input v-model="editingPrefix" class="add-option-name" type="text" placeholder="例如: USER-" maxlength="20" />
                      </div>
                    </template>
                    <!-- relation：关联配置 -->
                    <template v-else-if="effectiveType(property) === 'relation'">
                      <div class="expand-relation-config">
                        <!-- 只读展示（属性本身已是关联类型，非类型变更） -->
                        <template v-if="pendingPropertyTarget !== property">
                          <div class="relation-readonly-row">
                            <span class="relation-readonly-label">关联模式</span>
                            <span class="relation-readonly-value">{{ getRelationModeLabel(editingRelationMode) }}</span>
                          </div>
                          <div class="relation-readonly-row">
                            <span class="relation-readonly-label">目标数据源</span>
                            <span class="relation-readonly-value" :class="{ 'is-empty': !editingTargetDatasourceId }">{{ getTargetDatasourceTitle(editingTargetDatasourceId) }}</span>
                          </div>
                          <div v-if="editingRelationMode === 'dual_property'" class="relation-readonly-row">
                            <span class="relation-readonly-label">目标属性名称</span>
                            <span class="relation-readonly-value" :class="{ 'is-empty': !editingDualPropertyName }">{{ editingDualPropertyName || '未配置' }}</span>
                          </div>
                          <div v-if="!property.relation" class="relation-readonly-row">
                            <span class="relation-readonly-value is-empty">未配置关联</span>
                          </div>
                        </template>
                        <!-- 可编辑（从其他类型变更为关联类型） -->
                        <template v-else>
                        <a-select v-model:value="editingRelationMode" class="property-add-form-type"
                                  :virtual="false" placement="bottomLeft" placeholder="关联模式"
                                  dropdown-class-name="property-type-select-dropdown"
                                  :get-popup-container="getPopupContainer">
                          <a-select-option v-for="(label, value) in relationModeOptions" :key="value" :value="value">{{ label }}</a-select-option>
                        </a-select>
                        <a-select v-model:value="editingTargetDatasourceId" class="property-add-form-type"
                                  :virtual="false" placement="bottomLeft" placeholder="目标数据源"
                                  :show-search="true" :filter-option="filterPropertyTypeOption"
                                  :loading="targetDatasourceLoading"
                                  dropdown-class-name="property-type-select-dropdown"
                                  :get-popup-container="getPopupContainer"
                                  @focus="loadTargetDatasources">
                          <template #notFoundContent>
                            <div v-if="targetDatasourceLoading" class="select-loading-state">
                              <div class="select-loading-shimmer"></div>
                              <div class="select-loading-skeleton">
                                <div class="skeleton-row" v-for="i in 3" :key="i" :style="{ animationDelay: (i - 1) * 0.12 + 's' }">
                                  <span class="skeleton-bar"></span>
                                </div>
                              </div>
                              <div class="select-loading-hint">
                                <font-awesome-icon :icon="['fas', 'spinner']" spin />
                                <span>正在加载数据源列表...</span>
                              </div>
                            </div>
                          </template>
                          <a-select-option v-for="ds in targetDatasourceList" :key="ds.id" :value="ds.datasourceId">{{ ds.title }}</a-select-option>
                        </a-select>
                        <template v-if="editingRelationMode === 'dual_property'">
                          <input v-model="editingDualPropertyName" class="property-add-form-name" type="text"
                                 placeholder="目标数据源显示的属性名称" maxlength="80" />
                        </template>
                        </template>
                      </div>
                    </template>
                    <!-- select / multi_select / status：选项配置 -->
                    <template v-else>
                      <!-- 已有选项（可删除；类型变更中不展示旧选项） -->
                      <div v-if="pendingPropertyTarget !== property" class="expand-option-grid">
                        <div
                          v-for="(opt, index) in property.options"
                          :key="opt.id"
                          class="add-option-row"
                          :class="{ 'is-removed': pendingRemovedOptionIds.has(opt.id) }"
                          :style="{ animationDelay: index * 0.03 + 's', backgroundColor: optionBgColor(opt.color) }"
                        >
                          <div class="option-info-wrap">
                            <span class="add-option-name display">{{ opt.name }}</span>
                            <span v-if="opt.description" class="add-option-desc">{{ opt.description }}</span>
                          </div>
                          <button v-if="!pendingRemovedOptionIds.has(opt.id)" class="add-option-remove" type="button" @click="markOptionForRemoval(opt)" :disabled="propertySubmitLoading">
                            <font-awesome-icon :icon="['fas', 'xmark']" />
                          </button>
                          <button v-else class="add-option-remove is-undo" type="button" @click="unmarkOptionForRemoval(opt.id)" :disabled="propertySubmitLoading" title="撤销删除">
                            <font-awesome-icon :icon="['fas', 'rotate-left']" />
                          </button>
                        </div>
                      </div>
                      <!-- 新增选项（可编辑） -->
                      <template v-if="editingOptions.length">
                        <div class="expand-option-grid" style="margin-top: 6px">
                          <div
                            v-for="(opt, index) in editingOptions"
                            :key="'edit-' + index"
                            class="add-option-row"
                            :style="{ animationDelay: index * 0.03 + 's', backgroundColor: optionBgColor(opt.color) }"
                          >
                            <div class="add-option-color-palette">
                              <span v-for="c in NOTION_COLOR_OPTIONS" :key="c.name"
                                    class="add-option-swatch"
                                    :class="{ active: opt.color === c.name }"
                                    :style="{ backgroundColor: c.color }"
                                    :title="c.name"
                                    @click="opt.color = c.name"></span>
                            </div>
                            <input v-model="opt.name" class="add-option-name" type="text" placeholder="选项名称" maxlength="80" />
                            <button class="add-option-remove" type="button" @click="removeEditingOption(index)" :disabled="propertySubmitLoading">
                              <font-awesome-icon :icon="['fas', 'xmark']" />
                            </button>
                          </div>
                        </div>
                      </template>
                      <button class="add-option-btn" type="button" @click="addEditingOption" :disabled="propertySubmitLoading">
                        <font-awesome-icon :icon="['fas', 'plus']" />
                        <span>添加选项</span>
                      </button>
                    </template>
                    <!-- 操作按钮：类型变更、选项编辑、unique_id 配置时显示 -->
                    <div v-if="pendingPropertyTarget === property || editingOptions.length || effectiveType(property) === 'unique_id' || pendingRemovedOptionIds.size > 0" class="expand-option-actions">
                      <button type="button" class="property-cancel-btn" @click="cancelExpandConfig(property)" :disabled="propertySubmitLoading">取消</button>
                      <button type="button" class="property-confirm-btn" :disabled="propertySubmitLoading" @click="saveExpandConfig(property)">
                        {{ pendingPropertyTarget === property ? '保存' : editingOptions.length ? '保存选项' : '保存' }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>

              <!-- 添加属性 — 独立容器，居中于卡片底部 -->
              <div v-if="canEditDatasource" class="property-add-section">
                <div v-if="!addingProperty" class="property-add-trigger" tabindex="0" role="button"
                     @click="startAddProperty" @keydown.enter.prevent="startAddProperty" @keydown.space.prevent="startAddProperty">
                  <span class="property-add-trigger-icon"><font-awesome-icon :icon="['fas', 'plus']" /></span>
                  <span class="property-add-trigger-text">添加属性</span>
                </div>

                <div v-else class="property-add-form">
                  <span class="property-add-form-icon"><font-awesome-icon :icon="['fas', 'circle-plus']" /></span>
                  <div class="property-add-form-fields">
                    <input v-model="newPropertyName" class="property-add-form-name" type="text"
                           placeholder="属性名称" maxlength="80"
                           @keydown.enter.prevent="handleAddProperty" @keydown.esc.prevent="cancelAddProperty" />
                    <a-select v-model:value="newPropertyType" class="property-add-form-type"
                              :show-search="true" :filter-option="filterPropertyTypeOption" :virtual="false" placement="bottomLeft" placeholder="属性类型"
                              dropdown-class-name="property-add-form-dropdown"
                              :get-popup-container="getPopupContainer"
                              @keydown.esc.prevent="cancelAddProperty">
                      <a-select-option v-for="(label, value) in options" :key="value" :value="value">{{ label }}</a-select-option>
                    </a-select>

                    <!-- 唯一标识符前缀（仅 unique_id 显示） -->
                    <template v-if="newPropertyType === 'unique_id'">
                      <div class="add-option-label">标识符前缀</div>
                      <input v-model="newPropertyPrefix" class="property-add-form-name" type="text"
                             placeholder="例如: USER-" maxlength="20" />
                    </template>

                    <!-- 关联配置（仅 relation 显示） -->
                    <template v-if="newPropertyType === 'relation'">
                      <div class="add-option-label">关联配置</div>
                      <a-select v-model:value="newPropertyRelationMode" class="property-add-form-type"
                                :virtual="false" placement="bottomLeft" placeholder="关联模式"
                                dropdown-class-name="property-add-form-dropdown"
                                :get-popup-container="getPopupContainer"
                                @keydown.esc.prevent="cancelAddProperty">
                        <a-select-option v-for="(label, value) in relationModeOptions" :key="value" :value="value">{{ label }}</a-select-option>
                      </a-select>
                      <a-select v-model:value="newPropertyTargetDatasourceId" class="property-add-form-type"
                                :virtual="false" placement="bottomLeft" placeholder="目标数据源"
                                :show-search="true" :filter-option="filterPropertyTypeOption"
                                :loading="targetDatasourceLoading"
                                dropdown-class-name="property-add-form-dropdown"
                                :get-popup-container="getPopupContainer"
                                @keydown.esc.prevent="cancelAddProperty"
                                @focus="loadTargetDatasources">
                        <template #notFoundContent>
                          <div v-if="targetDatasourceLoading" class="select-loading-state">
                            <div class="select-loading-shimmer"></div>
                            <div class="select-loading-skeleton">
                              <div class="skeleton-row" v-for="i in 3" :key="i" :style="{ animationDelay: (i - 1) * 0.12 + 's' }">
                                <span class="skeleton-bar"></span>
                              </div>
                            </div>
                            <div class="select-loading-hint">
                              <font-awesome-icon :icon="['fas', 'spinner']" spin />
                              <span>正在加载数据源列表...</span>
                            </div>
                          </div>
                        </template>
                        <a-select-option v-for="ds in targetDatasourceList" :key="ds.id" :value="ds.datasourceId">{{ ds.title }}</a-select-option>
                      </a-select>
                      <template v-if="newPropertyRelationMode === 'dual_property'">
                        <input v-model="newPropertyDualPropertyName" class="property-add-form-name" type="text"
                               placeholder="目标数据源显示的属性名称" maxlength="80" />
                      </template>
                    </template>

                    <!-- 选项配置（仅 select / multi_select / status 显示） -->
                    <template v-if="SELECT_TYPES.has(newPropertyType)">
                      <div class="add-option-label">选项</div>
                      <div v-for="(opt, i) in newPropertyOptions" :key="i" class="add-option-row" :style="{ backgroundColor: optionBgColor(opt.color) }">
                        <div class="add-option-color-palette">
                          <span v-for="c in NOTION_COLOR_OPTIONS" :key="c.name"
                                class="add-option-swatch"
                                :class="{ active: opt.color === c.name }"
                                :style="{ backgroundColor: c.color }"
                                @click="opt.color = c.name"
                                :title="c.name"></span>
                        </div>
                        <input v-model="opt.name" class="add-option-name" type="text" placeholder="选项名称" maxlength="80" />
                        <button class="add-option-remove" type="button" @click="removeOption(i)" :disabled="newPropertySubmitting">
                          <font-awesome-icon :icon="['fas', 'xmark']" />
                        </button>
                      </div>
                      <button class="add-option-btn" type="button" @click="addOption" :disabled="newPropertySubmitting">
                        <font-awesome-icon :icon="['fas', 'plus']" />
                        <span>添加选项</span>
                      </button>
                    </template>
                  </div>
                  <div class="property-add-form-actions">
                    <button class="property-add-form-save" type="button"
                            :disabled="!newPropertyName.trim() || !newPropertyType || (newPropertyType === 'relation' && (!newPropertyRelationMode || !newPropertyTargetDatasourceId)) || newPropertySubmitting"
                            @click.stop="handleAddProperty">
                      <font-awesome-icon v-if="newPropertySubmitting" :icon="['fas', 'spinner']" spin />
                      <font-awesome-icon v-else :icon="['fas', 'check']" />
                      <span>添加</span>
                    </button>
                    <button class="property-add-form-cancel" type="button" :disabled="newPropertySubmitting"
                            @click.stop="cancelAddProperty">
                      <font-awesome-icon :icon="['fas', 'xmark']" />
                      <span>取消</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </template>

          <div v-else class="neo-empty-state">
            <div class="modern-empty-card">
              <div class="modern-empty-illus">
                <div class="mockup-window">
                  <div class="mockup-header">
                    <div class="mockup-dot"></div>
                    <div class="mockup-line short"></div>
                  </div>
                  <div class="mockup-row">
                    <font-awesome-icon :icon="['fas', 'star']" class="mockup-star" />
                    <div class="mockup-avatar"></div>
                    <div class="mockup-line"></div>
                  </div>
                  <div class="mockup-row">
                    <font-awesome-icon :icon="['fas', 'star']" class="mockup-star" />
                    <div class="mockup-avatar"></div>
                    <div class="mockup-line shorter"></div>
                  </div>
                </div>
              </div>
              <div class="modern-empty-content">
                <h3 class="modern-empty-title">{{ propertyLoading ? '正在读取属性' : '暂无属性' }}</h3>
                <p class="modern-empty-desc">{{ propertyLoading ? '请稍候' : '该数据源暂未同步到属性结构' }}</p>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
    </a-drawer>

    <AppleConfirmModal
      v-model:visible="deleteConfirmVisible"
      type="danger"
      title="删除数据源"
      :desc="deleteConfirmDesc"
      confirmText="确认删除"
      :loading="deleteConfirmLoading"
      @confirm="executeDelete"
    />

    <AppleConfirmModal
      v-model:visible="titleConfirmVisible"
      type="warning"
      title="保存标题变更"
      :desc="titleConfirmDesc"
      confirmText="保存"
      cancelText="放弃"
      :loading="titleSubmitLoading"
      @confirm="executeTitleUpdate"
      @cancel="cancelPendingTitleUpdate"
    />

    <AppleConfirmModal
      v-model:visible="propertyConfirmVisible"
      type="warning"
      title="保存属性名称"
      :desc="propertyConfirmDesc"
      confirmText="保存"
      cancelText="放弃"
      :loading="propertySubmitLoading"
      @confirm="executePropertyUpdate"
      @cancel="cancelPendingPropertyUpdate"
    />

    <AppleConfirmModal
      v-model:visible="propertyDeleteVisible"
      type="danger"
      title="删除属性"
      :desc="propertyDeleteDesc"
      confirmText="确认删除"
      :loading="propertyDeleteLoading"
      @confirm="executePropertyDelete"
    />

    <!-- 隐藏的上传图标文件输入 -->
    <input
      ref="iconFileInput"
      type="file"
      accept="image/png, image/jpeg, image/webp, image/svg+xml"
      class="icon-hidden-input"
      @change="handleIconFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import {
  getCurrentUserWorkspaces,
  getDatasourcePage,
  getDatasourceProperties,
  deleteDatasourceBatch,
  updateDatasourceTitle,
  updateDatasourceIcon,
  updateDatasourceProperty,
  addDatasourceProperty,
  deleteDatasourceProperty,
  uploadNotionFile,
  syncDatasource
} from '@/api/notion.ts'
import type { Datasource, DatasourceVo, NotionDatasourceProperty, NotionOption, Workspace } from '@/types'
import { AppleAlert } from '@/components/common/AppleAlert.ts'
import AppleConfirmModal from '@/components/common/AppleConfirmModal.vue'
import {getDictDataByDictCode, getDictDataByDictCodeEnable} from '@/api/dict.ts'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const loading = ref(false)
const syncing = ref(false)
const workspaceLoading = ref(false)
const propertyLoading = ref(false)
const propertyDrawerVisible = ref(false)
const expandedPropertyId = ref<string | null>(null)
/** 展开编辑的选项副本（浅拷贝原属性 options） */
const editingOptions = ref<NotionOption[]>([])
/** 待删除的已有选项 ID 集合 */
const pendingRemovedOptionIds = ref<Set<string>>(new Set())
/** 展开编辑：标识符前缀 */
const editingPrefix = ref('')
/** 展开编辑：关联模式 */
const editingRelationMode = ref<string>()
/** 展开编辑：关联目标数据源 */
const editingTargetDatasourceId = ref<string>()
/** 展开编辑：目标数据源属性名称 */
const editingDualPropertyName = ref('')

const workspaces = ref<Workspace[]>([])
const tableData = ref<Datasource[]>([])
const properties = ref<NotionDatasourceProperty[]>([])
const currentDatasource = ref<Datasource | null>(null)

/** 属性类型中文字典映射: 英文key -> 中文label */
const propertyTypeDict = ref<Record<string, string>>({})
const options = ref<Record<string, string>>({})

/** 加载 notion_property_type 字典数据 */
const loadPropertyTypeDict = async () => {
  try {
    const allRes = await getDictDataByDictCode('notion_property_type')
    if (allRes.data) {
      const allMap: Record<string, string> = {}
      allRes.data.forEach((item) => {
        allMap[item.dictValue] = item.dictLabel
      })
      propertyTypeDict.value = allMap
    }
    const res = await  getDictDataByDictCodeEnable("notion_property_type")
    if (res.data) {
      const map: Record<string, string> = {}
      res.data.forEach((item) => {
        map[item.dictValue] = item.dictLabel
      })
      options.value = map
    }
  } catch {
    // 字典加载失败时静默降级，使用英文原始值
  }
}

/** 关联模式字典 */
const relationModeOptions = ref<Record<string, string>>({})

/** 加载 notion_relation_mode 字典数据 */
const loadRelationModeDict = async () => {
  try {
    const res = await getDictDataByDictCodeEnable('notion_relation_mode')
    if (res.data) {
      const map: Record<string, string> = {}
      res.data.forEach((item) => {
        map[item.dictValue] = item.dictLabel
      })
      relationModeOptions.value = map
    }
  } catch {
    // 字典加载失败时静默降级
  }
}

/** 加载目标数据源列表（用于 relation 类型属性） */
const loadTargetDatasources = async () => {
  if (!searchForm.workspaceId) return
  targetDatasourceLoading.value = true
  try {
    const res = await getDatasourcePage({ workspaceId: searchForm.workspaceId, pageNum: 1, pageSize: 200 })
    targetDatasourceList.value = res.data?.list || []
  } catch {
    targetDatasourceList.value = []
  } finally {
    targetDatasourceLoading.value = false
  }
}

/** 获取属性类型的中文标签，降级为英文原始值 */
const getPropertyTypeLabel = (type?: string) => {
  if (!type) return '未知类型'
  return propertyTypeDict.value[type] || normalizeType(type)
}
const selectedRowKeys = ref<string[]>([])
const editingTitleId = ref('')
const editingTitleValue = ref('')
const pendingTitleTarget = ref<Datasource | null>(null)
const pendingTitleValue = ref('')
const titleConfirmVisible = ref(false)
const titleSubmitLoading = ref(false)

const editingNameId = ref('')
const editingTypeId = ref('')
const editingPropertyName = ref('')
const editingPropertyType = ref('')
const pendingPropertyTarget = ref<NotionDatasourceProperty | null>(null)
const pendingPropertyName = ref('')
const pendingPropertyType = ref('')
const propertyConfirmVisible = ref(false)
const propertySubmitLoading = ref(false)

// 拖拽排序
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// 添加属性表单
const addingProperty = ref(false)
const newPropertyName = ref('')
const newPropertyType = ref<string>()
const newPropertySubmitting = ref(false)
const newPropertyOptions = ref<{ name: string; color: string; description?: string }[]>([])
const newPropertyPrefix = ref('')
const newPropertyRelationMode = ref<string>()
const newPropertyTargetDatasourceId = ref<string>()
const newPropertyDualPropertyName = ref('')
const targetDatasourceList = ref<DatasourceVo[]>([])
const targetDatasourceLoading = ref(false)

const deleteConfirmVisible = ref(false)
const deleteConfirmLoading = ref(false)

const iconFileInput = ref<HTMLInputElement | null>(null)
const iconUploadTarget = ref<Datasource | null>(null)
const iconUploadingId = ref('')
const deleteConfirmDesc = computed(() =>
  `确定要删除选中的 ${selectedRowKeys.value.length} 个数据源吗？此操作不可恢复。`
)
const propertyDeleteVisible = ref(false)
const propertyDeleteLoading = ref(false)
const propertyDeleteTarget = ref<NotionDatasourceProperty | null>(null)
const propertyDeleteDesc = computed(() =>
  propertyDeleteTarget.value
    ? `确定要删除属性「${propertyDeleteTarget.value.propertyName || '未命名'}」吗？此操作不可恢复。`
    : ''
)
const titleConfirmDesc = computed(() =>
  `确定将数据源标题修改为「${pendingTitleValue.value}」吗？该变更会同步更新到 Notion。`
)
const propertyConfirmDesc = computed(() => {
  const parts: string[] = []
  if (pendingPropertyName.value && pendingPropertyTarget.value?.propertyName !== pendingPropertyName.value) {
    parts.push(`名称修改为「${pendingPropertyName.value}」`)
  }
  if (pendingPropertyType.value && pendingPropertyTarget.value?.propertyType !== pendingPropertyType.value) {
    const typeLabel = propertyTypeDict.value[pendingPropertyType.value] || pendingPropertyType.value
    parts.push(`类型修改为「${typeLabel}」`)
  }
  return parts.length > 0 ? `确定将属性${parts.join('，')}吗？` : '确定保存属性变更吗？'
})
const canDeleteDatasource = computed(() => userStore.hasPermission('datasource:delete'))
const canSyncDatasource = computed(() => userStore.hasPermission('datasource:sync'))
const canEditDatasource = computed(() => userStore.hasPermission('datasource:edit'))

/**
 * 抽屉中当前数据源的图标。
 */
const drawerIcon = computed(() => currentDatasource.value?.icon || '')

const workspaceSearchForm = reactive({
  workspaceName: '',
  workspaceCode: ''
})

const searchForm = reactive({
  workspaceId: '',
  title: '',
  pageNum: 1,
  pageSize: 8
})

const pagination = reactive({
  current: 1,
  pageSize: 8,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const datasourceColumns = [
  { title: '数据源', key: 'datasource', width: 300 },
  { title: '数据源 ID', key: 'datasourceId', width: 320 },
  { title: '操作', key: 'action', width: 110, align: 'center' }
]

const activeWorkspace = computed(() => workspaces.value.find(item => item.id === searchForm.workspaceId) || null)
const filteredWorkspaces = computed(() => {
  const name = workspaceSearchForm.workspaceName.trim().toLowerCase()
  const code = workspaceSearchForm.workspaceCode.trim().toLowerCase()

  return workspaces.value.filter(item => {
    const workspaceName = (item.name || '').toLowerCase()
    const workspaceCode = (item.code || '').toLowerCase()
    return (!name || workspaceName.includes(name)) && (!code || workspaceCode.includes(code))
  })
})

const isImage = (value?: string | null) => {
  if (!value) return false
  return value.startsWith('data:image') || value.startsWith('http://') || value.startsWith('https://')
}

const handleImgError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  const pad = (value: number) => String(value).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const normalizeType = (type?: string) => type || 'unknown'

/** 属性字段的去重类型数量 */
const uniqueTypeCount = computed(() => {
  const types = new Set(properties.value.map(p => normalizeType(p.propertyType)))
  return types.size
})

/** 属性类型 → 色彩映射（与图标配色保持一致） */
const PROPERTY_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  title:            { bg: '#E8F5E9', text: '#2E7D32' },
  rich_text:        { bg: '#E3F2FD', text: '#1565C0' },
  number:           { bg: '#FFF3E0', text: '#E65100' },
  select:           { bg: '#F3E5F5', text: '#7B1FA2' },
  multi_select:     { bg: '#EDE7F6', text: '#4A148C' },
  date:             { bg: '#E0F7FA', text: '#00695C' },
  checkbox:         { bg: '#FFF8E1', text: '#F57F17' },
  url:              { bg: '#E8EAF6', text: '#1A237E' },
  email:            { bg: '#FCE4EC', text: '#880E4F' },
  phone_number:     { bg: '#F1F8E9', text: '#33691E' },
  people:           { bg: '#E1F5FE', text: '#01579B' },
  files:            { bg: '#EFEBE9', text: '#3E2723' },
  relation:         { bg: '#F9FBE7', text: '#827717' },
  rollup:           { bg: '#E0F2F1', text: '#004D40' },
  formula:          { bg: '#FBE9E7', text: '#BF360C' },
  status:           { bg: '#E8F5E9', text: '#1B5E20' },
  created_time:     { bg: '#ECEFF1', text: '#37474F' },
  created_by:       { bg: '#E1F5FE', text: '#01579B' },
  last_edited_time: { bg: '#ECEFF1', text: '#37474F' },
  last_edited_by:   { bg: '#E1F5FE', text: '#01579B' }
}

const getTypeColorStyle = (type?: string) => {
  const colors = PROPERTY_TYPE_COLORS[type || ''] || { bg: '#F5F5F5', text: '#616161' }
  return {
    '--type-bg': colors.bg,
    '--type-text': colors.text
  } as Record<string, string>
}

const getPropertyIcon = (type?: string): [string, string] => {
  const map: Record<string, [string, string]> = {
    title: ['fas', 'heading'],
    rich_text: ['fas', 'font'],
    number: ['fas', 'hashtag'],
    select: ['fas', 'list'],
    multi_select: ['fas', 'tags'],
    date: ['fas', 'calendar-days'],
    checkbox: ['fas', 'square-check'],
    url: ['fas', 'link'],
    email: ['fas', 'envelope'],
    phone_number: ['fas', 'phone'],
    people: ['fas', 'users'],
    files: ['fas', 'paperclip'],
    relation: ['fas', 'diagram-project'],
    rollup: ['fas', 'chart-simple'],
    formula: ['fas', 'calculator'],
    status: ['fas', 'circle-half-stroke'],
    created_time: ['fas', 'clock'],
    created_by: ['fas', 'user-plus'],
    last_edited_time: ['fas', 'clock-rotate-left'],
    last_edited_by: ['fas', 'user-pen']
  }
  return map[type || ''] || ['fas', 'columns']
}

/** 有选项的选择类属性类型 */
const SELECT_TYPES = new Set(['select', 'multi_select', 'status'])

/** 类型变更时需内联展开配置的类型 */
const INLINE_CONFIG_TYPES = new Set(['select', 'multi_select', 'relation', 'status', 'unique_id'])

/** 当前展开面板的有效类型（类型变更中则用新类型，否则用原类型） */
const effectiveType = (property: NotionDatasourceProperty): string => {
  if (pendingPropertyTarget.value === property && pendingPropertyType.value) {
    return pendingPropertyType.value
  }
  return property.propertyType
}

/** 是否显示选项配置按钮（select / multi_select / status 类型） */
const showOptionButton = (property: NotionDatasourceProperty) =>
  SELECT_TYPES.has(property.propertyType)

/** 切换属性选项的展开/收起 */
const togglePropertyExpand = (property: NotionDatasourceProperty) => {
  if (expandedPropertyId.value === property.propertyId) {
    resetExpandConfig()
  } else {
    expandedPropertyId.value = property.propertyId
    editingOptions.value = []
    // 初始化已有配置值
    editingPrefix.value = property.prefix || ''
    if (property.relation) {
      editingRelationMode.value = property.relation.relationMode
      editingTargetDatasourceId.value = property.relation.datasourceId
      editingDualPropertyName.value = property.relation.dualPropertyName || ''
      // 预加载目标数据源列表，确保 select 能正确显示当前配置的名称
      loadTargetDatasources()
    } else {
      editingRelationMode.value = undefined
      editingTargetDatasourceId.value = undefined
      editingDualPropertyName.value = ''
    }
  }
}

/** 获取关联模式的中文标签 */
const getRelationModeLabel = (mode?: string) => {
  if (!mode) return '未配置'
  return relationModeOptions.value[mode] || mode
}

/** 通过 datasourceId 查找目标数据源标题 */
const getTargetDatasourceTitle = (id?: string) => {
  if (!id) return '未配置'
  const ds = targetDatasourceList.value.find(d => d.datasourceId === id)
  return ds?.title || id
}

/** Notion 选项颜色 → CSS 色值映射（对齐 Notion 官方色板） */
const NOTION_COLOR_MAP: Record<string, { bg: string; text: string }> = {
  default:        { bg: '#F1F1F0', text: '#37352F' },
  gray:           { bg: '#F1F1EF', text: '#9B9A97' },
  brown:          { bg: '#F3EEEE', text: '#64473A' },
  orange:         { bg: '#FBECDD', text: '#D9730D' },
  yellow:         { bg: '#FBF3DB', text: '#DFAB01' },
  green:          { bg: '#EDF3EC', text: '#0F7B6C' },
  blue:           { bg: '#E7F3F8', text: '#0B6E99' },
  purple:         { bg: '#F4F0F7', text: '#6940A5' },
  pink:           { bg: '#F9F2F5', text: '#AD1A72' },
  red:            { bg: '#FDEBEB', text: '#E03E3E' },
}

/** 选项颜色调色板（供用户选择） */
const NOTION_COLOR_OPTIONS = Object.entries(NOTION_COLOR_MAP).map(([name, { text: color }]) => ({ name, color }))

/** 计算选项行背景色（light 直接返回 bg，dark 轻混合深色底） */
const optionBgColor = (colorName: string): string => {
  const key = (colorName || '').toLowerCase()
  const c = NOTION_COLOR_MAP[key] || NOTION_COLOR_MAP.default
  if (!appStore.isDark) return c.bg
  // 暗黑模式：用极低比例混合，仅保留微弱色调
  const isDefault = key === 'default'
  const hex = (isDefault ? c.bg : c.text).replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const bgR = 44, bgG = 44, bgB = 46
  const f = isDefault ? 0.08 : 0.12
  const mix = (v: number, base: number) => Math.round(v * f + base * (1 - f))
  return '#' + [mix(r, bgR), mix(g, bgG), mix(b, bgB)].map(v => v.toString(16).padStart(2, '0')).join('')
}

const addOption = () => {
  newPropertyOptions.value.push({ name: '', color: 'default', description: '' })
}

const removeOption = (index: number) => {
  newPropertyOptions.value.splice(index, 1)
}

/** 编辑已有属性：添加选项 */
const addEditingOption = () => {
  editingOptions.value.push({ name: '', color: 'default' } as NotionOption)
}

/** 编辑已有属性：删除选项 */
const removeEditingOption = (index: number) => {
  editingOptions.value.splice(index, 1)
}

/** 标记已有选项为待删除 */
const markOptionForRemoval = (opt: NotionOption) => {
  pendingRemovedOptionIds.value = new Set([...pendingRemovedOptionIds.value, opt.id])
}

/** 取消标记已有选项为待删除 */
const unmarkOptionForRemoval = (optId: string) => {
  const next = new Set(pendingRemovedOptionIds.value)
  next.delete(optId)
  pendingRemovedOptionIds.value = next
}

/** 编辑已有属性：统一保存（类型变更 + 选项 / 前缀 / 关联） */
const saveExpandConfig = async (property: NotionDatasourceProperty) => {
  propertySubmitLoading.value = true
  try {
    const isTypeChange = pendingPropertyTarget.value === property && !!pendingPropertyType.value
    const propertyData: Record<string, unknown> = {
      name: property.propertyName,
      type: isTypeChange ? pendingPropertyType.value : property.propertyType,
    }
    const nextType = (isTypeChange ? pendingPropertyType.value : property.propertyType) as string

    if (SELECT_TYPES.has(nextType)) {
      // 选项配置：排除已标记删除的，合并已有 + 新增
      const existing = (property.options || [])
        .filter(opt => !pendingRemovedOptionIds.value.has(opt.id))
        .map(opt => ({ name: opt.name, color: opt.color, description: opt.description }))
      const added = editingOptions.value.map(opt => ({ name: opt.name, color: opt.color, description: opt.description }))
      propertyData.options = isTypeChange ? added : [...existing, ...added]
    } else if (nextType === 'unique_id') {
      propertyData.prefix = editingPrefix.value || undefined
    } else if (nextType === 'relation') {
      if (editingRelationMode.value && editingTargetDatasourceId.value) {
        propertyData.relation = {
          relationMode: editingRelationMode.value,
          datasourceId: editingTargetDatasourceId.value,
          ...(editingRelationMode.value === 'dual_property' && editingDualPropertyName.value.trim()
            ? { dualPropertyName: editingDualPropertyName.value.trim() }
            : {}),
        }
      }
    }

    await updateDatasourceProperty({ id: property.id, property: propertyData })

    // 本地状态更新
    if (isTypeChange) {
      property.propertyType = pendingPropertyType.value!
    }
    if (nextType === 'unique_id') {
      property.prefix = editingPrefix.value || undefined
    }
    if (nextType === 'relation' && editingRelationMode.value && editingTargetDatasourceId.value) {
      property.relation = {
        relationMode: editingRelationMode.value,
        datasourceId: editingTargetDatasourceId.value,
        ...(editingRelationMode.value === 'dual_property' && editingDualPropertyName.value.trim()
          ? { dualPropertyName: editingDualPropertyName.value.trim() }
          : {}),
      }
    }
    if (SELECT_TYPES.has(nextType)) {
      const added = editingOptions.value.map(opt => ({ ...opt } as NotionOption))
      const kept = (property.options || []).filter(opt => !pendingRemovedOptionIds.value.has(opt.id))
      property.options = isTypeChange ? added : [...kept, ...added]
    }
    AppleAlert.success('保存成功', '配置已更新')
    resetExpandConfig()
  } catch (error: any) {
    AppleAlert.error('保存失败', error.message || '无法保存配置')
  } finally {
    propertySubmitLoading.value = false
  }
}

/** 编辑已有属性：统一取消 */
const cancelExpandConfig = (_property: NotionDatasourceProperty) => {
  resetExpandConfig()
}

/** 重置展开面板状态 */
const resetExpandConfig = () => {
  expandedPropertyId.value = null
  editingOptions.value = []
  pendingRemovedOptionIds.value = new Set()
  editingPrefix.value = ''
  editingRelationMode.value = undefined
  editingTargetDatasourceId.value = undefined
  editingDualPropertyName.value = ''
  // 如果类型变更中，重置 pending
  if (pendingPropertyType.value) {
    resetPendingPropertyUpdate()
  }
}

const optionChipStyle = (color?: string): Record<string, string> => {
  const fallback = { backgroundColor: NOTION_COLOR_MAP.default!.bg, color: NOTION_COLOR_MAP.default!.text }
  if (!color) return fallback

  // 颜色名匹配（大小写不敏感）
  const key = color.toLowerCase()
  if (NOTION_COLOR_MAP[key]) {
    const c = NOTION_COLOR_MAP[key]!
    return { backgroundColor: c.bg, color: c.text }
  }

  // hex 色值直出：自动生成浅色背景
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const bgR = Math.round(r + (255 - r) * 0.85)
    const bgG = Math.round(g + (255 - g) * 0.85)
    const bgB = Math.round(b + (255 - b) * 0.85)
    const bgHex = '#' + [bgR, bgG, bgB].map(v => v.toString(16).padStart(2, '0')).join('')
    return { backgroundColor: bgHex, color: color }
  }

  return fallback
}

const goToConfig = () => {
  router.push({ name: 'NotionConfig' })
}

const clearCurrentDatasource = () => {
  currentDatasource.value = null
  properties.value = []
}

const resetInlineTitleEdit = () => {
  editingTitleId.value = ''
  editingTitleValue.value = ''
}

const resetPendingTitleUpdate = () => {
  pendingTitleTarget.value = null
  pendingTitleValue.value = ''
}

const resetPropertyNameEdit = () => {
  editingNameId.value = ''
  editingTypeId.value = ''
  editingPropertyName.value = ''
  editingPropertyType.value = ''
}

const resetPendingPropertyUpdate = () => {
  pendingPropertyTarget.value = null
  pendingPropertyName.value = ''
  pendingPropertyType.value = ''
}

/** 点击属性名 → 只编辑名称 */
const startEditName = (property: NotionDatasourceProperty) => {
  if (propertySubmitLoading.value) return
  editingNameId.value = property.propertyId
  editingTypeId.value = ''
  editingPropertyName.value = property.propertyName || ''
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(`[data-prop-edit-id="${property.propertyId}"]`)
    input?.focus()
    input?.select()
  })
}

/** 点击属性类型 → 只编辑类型（TITLE 不可修改，再次点击取消） */
const startEditType = (property: NotionDatasourceProperty) => {
  if (propertySubmitLoading.value) return
  if (property.propertyType === 'TITLE') return
  if (editingTypeId.value === property.propertyId) {
    resetPropertyNameEdit()
    return
  }
  editingTypeId.value = property.propertyId
  editingNameId.value = ''
  editingPropertyType.value = property.propertyType
}

/** a-select 搜索过滤 */
const filterPropertyTypeOption = (input: string, option: any) => {
  return (option.label || option.value || '').toLowerCase().includes(input.toLowerCase())
}

/** a-select 下拉面板挂载到 body，避免被父容器裁剪 */
const getPopupContainer = () => document.body

const cancelPropertyNameEdit = () => {
  resetPropertyNameEdit()
}

const handlePropertyNameEnter = () => {
  const input = document.activeElement as HTMLInputElement
  input?.blur()
}

/** 名称输入框失焦 */
const handleNameBlur = (property: NotionDatasourceProperty) => {
  if (editingNameId.value !== property.propertyId) return
  const nextName = editingPropertyName.value.trim()
  const prevName = property.propertyName || ''
  resetPropertyNameEdit()
  if (!nextName) {
    AppleAlert.warning('属性名不能为空', '请输入属性名称')
    return
  }
  if (nextName === prevName) return
  pendingPropertyTarget.value = property
  pendingPropertyName.value = nextName
  pendingPropertyType.value = ''
  propertyConfirmVisible.value = true
}

/** 类型下拉 change 或失焦 */
const handleTypeChange = (property: NotionDatasourceProperty) => {
  if (editingTypeId.value !== property.propertyId) return
  const nextType = editingPropertyType.value
  const prevType = property.propertyType
  resetPropertyNameEdit()
  if (nextType === prevType) return
  pendingPropertyTarget.value = property
  pendingPropertyName.value = ''
  pendingPropertyType.value = nextType
  if (INLINE_CONFIG_TYPES.has(nextType)) {
    // 展开配置面板而非弹出确认框
    expandedPropertyId.value = property.propertyId
    editingOptions.value = []
    editingPrefix.value = ''
    editingRelationMode.value = undefined
    editingTargetDatasourceId.value = undefined
    editingDualPropertyName.value = ''
  } else {
    propertyConfirmVisible.value = true
  }
}

const cancelPendingPropertyUpdate = () => {
  resetPendingPropertyUpdate()
}

const executePropertyUpdate = async () => {
  if (!pendingPropertyTarget.value) {
    propertyConfirmVisible.value = false
    return
  }
  if (!pendingPropertyName.value && !pendingPropertyType.value) {
    propertyConfirmVisible.value = false
    return
  }
  const target = pendingPropertyTarget.value
  const targetId = target.id
  const nextName = pendingPropertyName.value || undefined
  const nextType = pendingPropertyType.value || undefined
  propertySubmitLoading.value = true
  try {
    const propertyData: Record<string, unknown> = {
      name: nextName || target.propertyName,
    }
    // title 类型不传 type
    if (target.propertyType !== 'title') {
      propertyData.type = nextType || target.propertyType
    }
    await updateDatasourceProperty({
      id: targetId,
      property: propertyData,
    })
    AppleAlert.success('保存成功', '属性已更新')
    const updated = properties.value.find(p => p.id === targetId)
    if (updated) {
      if (nextName) updated.propertyName = nextName
      if (nextType) updated.propertyType = nextType
    }
    propertyConfirmVisible.value = false
    resetPendingPropertyUpdate()
  } catch (error: any) {
    AppleAlert.error('保存失败', error.message || '无法修改属性')
  } finally {
    propertySubmitLoading.value = false
  }
}

// ==================== 拖拽排序 ====================

const handleDragStart = (event: DragEvent, index: number) => {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

const handleDragEnter = (_event: DragEvent, index: number) => {
  if (dragIndex.value === null) return
  dragOverIndex.value = index
}

const handleDragLeave = (_event: DragEvent, _index: number) => {
  // 鼠标准确离开时才清除
  dragOverIndex.value = null
}

const handleDrop = async (event: DragEvent, index: number) => {
  event.preventDefault()
  const from = dragIndex.value
  const to = index
  dragIndex.value = null
  dragOverIndex.value = null

  if (from === null || from === to) return

  // 本地重排
  const list = [...properties.value]
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
  properties.value = list

  // 保存排序到后端
  await saveSortOrder()
}

const handleDragEnd = () => {
  dragIndex.value = null
  dragOverIndex.value = null
}

/** 将当前属性顺序保存到后端 */
const saveSortOrder = async () => {
  const list = properties.value
  for (let i = 0; i < list.length; i++) {
    const property = list[i]
    if (property.sort !== i) {
      try {
        await updateDatasourceProperty({ id: property.id, sort: i })
        property.sort = i
      } catch {
        // 静默失败，不影响后续
      }
    }
  }
}

// ==================== 添加属性 ====================

const startAddProperty = () => {
  addingProperty.value = true
  newPropertyName.value = ''
  newPropertyType.value = undefined
  newPropertyOptions.value = []
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>('.property-add-form-name')
    input?.focus()
  })
}

const cancelAddProperty = () => {
  addingProperty.value = false
  newPropertyName.value = ''
  newPropertyType.value = undefined
  newPropertyOptions.value = []
  newPropertyPrefix.value = ''
  newPropertyRelationMode.value = undefined
  newPropertyTargetDatasourceId.value = undefined
  newPropertyDualPropertyName.value = ''
  targetDatasourceList.value = []
  expandedPropertyId.value = null
}

const handleAddProperty = async () => {
  const name = newPropertyName.value.trim()
  const type = newPropertyType.value
  if (!name || !type) return
  if (!currentDatasource.value) return
  newPropertySubmitting.value = true
  try {
    await addDatasourceProperty({
      datasourceId: currentDatasource.value.id,
      property: {
        name,
        type,
        ...(type === 'unique_id' && newPropertyPrefix.value.trim()
          ? { prefix: newPropertyPrefix.value.trim() }
          : {}),
        ...(SELECT_TYPES.has(type) && newPropertyOptions.value.length
          ? { options: newPropertyOptions.value.filter(o => o.name.trim()) }
          : {}),
        ...(type === 'relation' && newPropertyRelationMode.value && newPropertyTargetDatasourceId.value
          ? { relation: { relationMode: newPropertyRelationMode.value, datasourceId: newPropertyTargetDatasourceId.value, ...(newPropertyRelationMode.value === 'dual_property' && newPropertyDualPropertyName.value.trim() ? { dualPropertyName: newPropertyDualPropertyName.value.trim() } : {}) } }
          : {})
      }
    })
    AppleAlert.success('添加成功', `属性「${name}」已添加`)
    cancelAddProperty()
    await refreshProperties()
  } catch (error: any) {
    AppleAlert.error('添加失败', error.message || '无法添加属性')
  } finally {
    newPropertySubmitting.value = false
  }
}

const refreshProperties = async () => {
  if (!currentDatasource.value) return
  propertyLoading.value = true
  try {
    const res = await getDatasourceProperties(currentDatasource.value.id)
    properties.value = res.data || []
  } catch {
    // 静默失败
  } finally {
    propertyLoading.value = false
  }
}

const clearSelection = () => {
  selectedRowKeys.value = []
}

const resetDatasourceState = () => {
  tableData.value = []
  pagination.current = 1
  pagination.total = 0
  pagination.pageSize = searchForm.pageSize
  clearCurrentDatasource()
  clearSelection()
  resetInlineTitleEdit()
  resetPendingTitleUpdate()
  propertyDrawerVisible.value = false
}

const fetchWorkspaces = async () => {
  workspaceLoading.value = true
  try {
    const res = await getCurrentUserWorkspaces()
    const workspaceList = res.data || []
    workspaces.value = workspaceList
    if (searchForm.workspaceId && !workspaceList.some(item => item.id === searchForm.workspaceId)) {
      searchForm.workspaceId = ''
      resetDatasourceState()
    }
  } catch (error: any) {
    AppleAlert.error('工作区读取失败', error.message || '请稍后重试')
  } finally {
    workspaceLoading.value = false
  }
}

const fetchData = async () => {
  if (!searchForm.workspaceId) {
    resetDatasourceState()
    return
  }

  loading.value = true
  try {
    const res = await getDatasourcePage(searchForm)
    tableData.value = res.data.list || []
    pagination.total = res.data.total || 0
    pagination.current = res.data.pageNum || searchForm.pageNum
    pagination.pageSize = res.data.pageSize || searchForm.pageSize
    selectedRowKeys.value = selectedRowKeys.value.filter(id => tableData.value.some(item => item.id === id))

    if (currentDatasource.value && !tableData.value.some(item => item.id === currentDatasource.value?.id)) {
      clearCurrentDatasource()
      propertyDrawerVisible.value = false
    }
  } catch (error: any) {
    AppleAlert.error('数据源读取失败', error.message || '请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleWorkspaceSearch = () => {
  if (searchForm.workspaceId && !filteredWorkspaces.value.some(item => item.id === searchForm.workspaceId)) {
    searchForm.workspaceId = ''
    resetDatasourceState()
  }
}

const handleWorkspaceReset = () => {
  workspaceSearchForm.workspaceName = ''
  workspaceSearchForm.workspaceCode = ''
}

const selectWorkspace = (workspaceId: string) => {
  searchForm.workspaceId = workspaceId
  searchForm.title = ''
  searchForm.pageNum = 1
  pagination.current = 1
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  targetDatasourceList.value = []
  fetchData()
}

const handleSearch = () => {
  searchForm.pageNum = 1
  pagination.current = 1
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.pageNum = 1
  pagination.current = 1
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handlePageChange = (page: number, pageSize: number) => {
  searchForm.pageNum = page
  searchForm.pageSize = pageSize
  pagination.current = searchForm.pageNum
  pagination.pageSize = searchForm.pageSize
  clearCurrentDatasource()
  clearSelection()
  propertyDrawerVisible.value = false
  fetchData()
}

const handlePageSizeChange = (_current: number, size: number) => {
  handlePageChange(1, size)
}

const handleSync = async () => {
  if (!activeWorkspace.value) {
    AppleAlert.warning('请选择工作区', '同步数据源需要指定工作区')
    return
  }

  syncing.value = true
  try {
    const res = await syncDatasource(activeWorkspace.value.id)
    AppleAlert.success('同步完成', `已同步 ${res.data || 0} 个数据源`)
    clearCurrentDatasource()
    clearSelection()
    propertyDrawerVisible.value = false
    await fetchData()
  } catch (error: any) {
    AppleAlert.error('同步失败', error.message || '请检查工作区访问令牌')
  } finally {
    syncing.value = false
  }
}

const onSelectChange = (keys: Array<string | number>) => {
  selectedRowKeys.value = keys.map(String)
}

// ==================== 图标上传 ====================

const triggerIconUpload = (record: Datasource) => {
  if (!canEditDatasource.value) return
  iconUploadTarget.value = record
  iconFileInput.value?.click()
}

const handleIconFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !iconUploadTarget.value || !activeWorkspace.value) return

  // 校验文件类型
  if (!file.type.startsWith('image/')) {
    AppleAlert.warning('格式不支持', '请选择图片文件')
    iconUploadTarget.value = null
    return
  }
  // 校验文件大小（2MB）
  if (file.size > 2 * 1024 * 1024) {
    AppleAlert.warning('文件过大', '图标文件不能超过 2MB')
    iconUploadTarget.value = null
    return
  }

  const targetId = iconUploadTarget.value.id
  iconUploadingId.value = targetId

  uploadNotionFile(activeWorkspace.value.id, file, {
    onComplete(event) {
      const fileId = event.fileId
      if (!fileId) {
        AppleAlert.error('上传失败', '未获取到文件信息')
        iconUploadingId.value = ''
        iconUploadTarget.value = null
        return
      }

      // 调用后端接口更新数据源图标
      updateDatasourceIcon({ id: targetId, uploadId: fileId })
        .then(() => {
          // 刷新数据源列表以获取更新后的图标
          fetchData()
        })
        .catch((error: any) => {
          AppleAlert.error('图标更新失败', error.message || '请稍后重试')
        })
        .finally(() => {
          iconUploadingId.value = ''
          iconUploadTarget.value = null
        })
    },
    onError(event) {
      AppleAlert.error('上传失败', event.message)
      iconUploadingId.value = ''
      iconUploadTarget.value = null
    }
  })
}

const confirmBatchDelete = () => {
  if (selectedRowKeys.value.length === 0) {
    AppleAlert.warning('请选择数据源', '请先选择需要删除的数据源')
    return
  }
  deleteConfirmVisible.value = true
}

const executeDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    deleteConfirmVisible.value = false
    return
  }

  deleteConfirmLoading.value = true
  try {
    const ids = [...selectedRowKeys.value]
    await deleteDatasourceBatch(ids)
    AppleAlert.success('删除成功', `已删除 ${ids.length} 个数据源`)
    clearSelection()
    clearCurrentDatasource()
    propertyDrawerVisible.value = false

    if (tableData.value.length === ids.length && searchForm.pageNum > 1) {
      searchForm.pageNum -= 1
      pagination.current = searchForm.pageNum
    }

    deleteConfirmVisible.value = false
    await fetchData()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '无法删除数据源')
  } finally {
    deleteConfirmLoading.value = false
  }
}

const confirmPropertyDelete = (property: NotionDatasourceProperty) => {
  propertyDeleteTarget.value = property
  propertyDeleteVisible.value = true
}

const executePropertyDelete = async () => {
  const target = propertyDeleteTarget.value
  if (!target) return
  propertyDeleteLoading.value = true
  try {
    await deleteDatasourceProperty(target.id)
    AppleAlert.success('删除成功', `属性「${target.propertyName || '未命名'}」已删除`)
    propertyDeleteVisible.value = false
    await refreshProperties()
  } catch (error: any) {
    AppleAlert.error('删除失败', error.message || '无法删除属性')
  } finally {
    propertyDeleteLoading.value = false
  }
}

const startInlineTitleEdit = (record: Datasource) => {
  if (titleSubmitLoading.value) return
  editingTitleId.value = record.id
  editingTitleValue.value = record.title || ''
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(`[data-title-edit-id="${record.id}"]`)
    input?.focus()
    input?.select()
  })
}

const cancelInlineTitleEdit = () => {
  resetInlineTitleEdit()
}

const handleTitleEnter = (event: KeyboardEvent) => {
  ;(event.target as HTMLInputElement).blur()
}

const handleTitleInputBlur = (record: Datasource) => {
  if (editingTitleId.value !== record.id) return

  const nextTitle = editingTitleValue.value.trim()
  const prevTitle = record.title || ''
  resetInlineTitleEdit()

  if (!nextTitle) {
    AppleAlert.warning('标题不能为空', '请输入数据源标题')
    return
  }

  if (nextTitle === prevTitle) {
    return
  }

  pendingTitleTarget.value = record
  pendingTitleValue.value = nextTitle
  titleConfirmVisible.value = true
}

const cancelPendingTitleUpdate = () => {
  resetPendingTitleUpdate()
}

const executeTitleUpdate = async () => {
  if (!pendingTitleTarget.value || !pendingTitleValue.value) {
    titleConfirmVisible.value = false
    resetPendingTitleUpdate()
    return
  }

  const targetId = pendingTitleTarget.value.id
  const nextTitle = pendingTitleValue.value
  titleSubmitLoading.value = true
  try {
    await updateDatasourceTitle({
      id: targetId,
      title: nextTitle
    })
    AppleAlert.success('保存成功', '数据源标题已更新')

    const updated = tableData.value.find(item => item.id === targetId)
    if (updated) {
      updated.title = nextTitle
    }
    if (currentDatasource.value?.id === targetId) {
      currentDatasource.value = { ...currentDatasource.value, title: nextTitle }
    }

    titleConfirmVisible.value = false
    resetPendingTitleUpdate()
  } catch (error: any) {
    AppleAlert.error('保存失败', error.message || '无法修改数据源标题')
  } finally {
    titleSubmitLoading.value = false
  }
}

const openProperties = async (record: Datasource) => {
  currentDatasource.value = record
  propertyDrawerVisible.value = true
  propertyLoading.value = true
  properties.value = []

  // 首次打开时加载属性类型中文字典和关联模式字典
  if (Object.keys(propertyTypeDict.value).length === 0) {
    await loadPropertyTypeDict()
    await loadRelationModeDict()
  }

  try {
    const res = await getDatasourceProperties(record.id)
    properties.value = res.data || []
  } catch (error: any) {
    AppleAlert.error('字段读取失败', error.message || '请稍后重试')
  } finally {
    propertyLoading.value = false
  }
}

onMounted(async () => {
  await fetchWorkspaces()
  resetDatasourceState()
})
</script>

<style scoped>
.neo-datasource-container {
  display: flex;
  height: calc(100vh - 120px);
  min-height: 600px;
  gap: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.neo-sidebar {
  width: 360px;
  flex-shrink: 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  overflow: hidden;
}

.sidebar-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: var(--text-main, #1d1d1f);
}

.sidebar-search-wrapper {
  padding: 0 20px 16px;
  box-sizing: border-box;
}

.capsule-search {
  display: flex;
  width: 100%;
  background: var(--card-bg, #f5f5f7);
  border-radius: 14px;
  padding: 4px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  box-sizing: border-box;
  align-items: center;
}

.capsule-search:focus-within {
  background: var(--card-bg, #ffffff);
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
}

.search-inputs {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 4px;
  height: 26px;
  min-width: 0;
}

.search-inputs input {
  flex: 1;
  min-width: 0;
  width: 0;
  border: none;
  background: transparent;
  font-size: 13px;
  color: var(--text-main);
  outline: none;
  padding: 0 8px;
  height: 26px;
  line-height: 26px;
}

.search-inputs input::placeholder {
  color: var(--text-muted, #a1a1aa);
}

.divider {
  width: 1px;
  height: 14px;
  background: var(--border-color, #e5e5ea);
  margin: 0 4px;
  flex-shrink: 0;
}

.search-actions {
  display: flex;
  gap: 4px;
}

.search-trigger {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  background: var(--apple-blue, #0A84FF);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-trigger:hover {
  filter: brightness(0.9);
  transform: scale(0.95);
}

.search-trigger.reset-btn {
  background: var(--hover-bg, #e5e5ea);
  color: var(--text-main, #333333);
}

.search-trigger.reset-btn:hover {
  background: var(--active-bg, rgba(0, 0, 0, 0.1));
  color: var(--text-main, #1d1d1f);
}

.sidebar-list-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.sidebar-list-container::-webkit-scrollbar {
  width: 4px;
}

.sidebar-list-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.neo-list-item {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 14px 12px;
  margin-bottom: 4px;
  border-radius: 14px;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  user-select: none;
}

.neo-list-item:hover {
  background: var(--hover-bg, #f5f5f7);
}

.neo-list-item.is-active {
  background: color-mix(in srgb, var(--apple-blue) 8%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue) 15%, transparent);
}

.item-prefix {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 12px;
}

.workspace-mini-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent);
  font-size: 14px;
  font-weight: 800;
}

.workspace-mini-icon img,
.datasource-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50%;
}

.item-subtitle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  line-height: normal;
  font-size: 12px;
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0 8px;
  box-sizing: border-box;
  flex-shrink: 1;
}

.neo-list-item.is-active .item-title {
  color: var(--apple-blue);
  font-weight: 700;
}

.item-tail {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 24px;
  color: var(--text-muted);
  font-size: 12px;
}

.neo-list-item.is-active .item-tail {
  color: var(--apple-blue);
}

.sidebar-empty-wrap {
  min-height: 360px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-footer {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}

.custom-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 220px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--content-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e5ea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main, #333333);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px var(--shadow-color, rgba(0, 0, 0, 0.05));
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: var(--hover-bg, #f5f5f7);
  box-shadow: none;
}

.page-stats {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.neo-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: var(--card-bg, #ffffff);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.neo-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--apple-blue, #0A84FF) 3%, transparent) 0%, transparent 50%),
    radial-gradient(circle at bottom left, color-mix(in srgb, var(--apple-blue, #0A84FF) 2%, transparent) 0%, transparent 50%);
  z-index: 10;
}

.data-empty-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.modern-empty-card {
  width: 100%;
  max-width: 380px;
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  animation: float-up-fade 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.modern-empty-illus {
  width: 100%;
  height: 140px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--apple-blue) 40%, transparent),
    color-mix(in srgb, var(--apple-blue) 5%, transparent)
  );
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 40px;
  box-sizing: border-box;
}

.mockup-window {
  width: 100%;
  height: 100px;
  background: var(--content-bg);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 2;
}

.mockup-header,
.mockup-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mockup-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-color);
}

.mockup-line {
  height: 6px;
  border-radius: 3px;
  background: var(--hover-bg);
  flex: 1;
}

.mockup-line.short {
  width: 60%;
  flex: none;
}

.mockup-line.shorter {
  width: 40%;
  flex: none;
}

.mockup-star {
  color: var(--border-color);
  font-size: 10px;
}

.mockup-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--hover-bg);
}

.modern-empty-content {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modern-empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 12px;
  letter-spacing: -0.3px;
}

.modern-empty-desc {
  white-space: pre-line;
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 0 24px;
  line-height: 1.6;
}

.modern-empty-desc:last-child {
  margin-bottom: 0;
}

.modern-empty-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 20px;
  background: var(--text-main);
  color: var(--bg-base);
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modern-empty-btn:hover:not(:disabled) {
  transform: scale(0.96);
  opacity: 0.9;
}

.modern-empty-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.modern-empty-card.mini {
  max-width: 260px;
}

.modern-empty-card.mini .modern-empty-illus {
  height: 100px;
  padding: 0 20px;
}

.modern-empty-card.mini .mockup-window {
  height: 70px;
  gap: 12px;
}

.modern-empty-card.mini .modern-empty-content {
  padding: 20px 16px;
}

.modern-empty-card.mini .modern-empty-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.modern-empty-card.mini .modern-empty-desc {
  font-size: 12px;
  margin-bottom: 0;
}

.modern-empty-card.mini .mini-btn {
  height: 30px;
  margin-top: 12px;
  padding: 0 13px;
  border-radius: 999px;
  background: var(--hover-bg, rgba(0, 0, 0, 0.05));
  color: var(--text-main);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  box-shadow: none;
  font-size: 12px;
  font-weight: 650;
  gap: 6px;
}

.modern-empty-card.mini .mini-btn svg {
  font-size: 11px;
}

.modern-empty-card.mini .mini-btn:hover:not(:disabled) {
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent);
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent);
  transform: translateY(-1px);
  opacity: 1;
}

@keyframes float-up-fade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.neo-data-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.data-header {
  padding: 24px 32px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-info h1 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.dict-meta-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  color: var(--apple-blue);
  background: color-mix(in srgb, var(--apple-blue) 12%, transparent);
  padding: 0 10px;
  height: 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--apple-blue) 20%, transparent);
  line-height: normal;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dict-remark {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
  max-width: 720px;
}

.data-toolbar {
  padding: 0 32px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.data-capsule {
  width: auto;
  min-width: 450px;
  max-width: 760px;
}

.data-actions {
  display: flex;
  gap: 8px;
}

.delete-action-btn,
.sync-action-btn {
  height: 36px;
  padding: 0 14px;
  border-radius: 12px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.delete-action-btn {
  background: rgba(255, 69, 58, 0.12);
  color: #FF453A;
  border: 1px solid rgba(255, 69, 58, 0.16);
}

.delete-action-btn:hover:not(:disabled) {
  background: #FF453A;
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(255, 69, 58, 0.18);
}

.delete-action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.sync-action-btn {
  background: #1d1d1f;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.sync-action-btn:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}

.sync-action-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.data-table-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 32px;
}

:deep(.data-spin-wrap),
:deep(.data-spin-wrap > .ant-spin-container) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.data-spin-wrap > .ant-spin-container) {
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

:deep(.data-spin-wrap > .ant-spin-container::-webkit-scrollbar) {
  width: 4px;
}

:deep(.data-spin-wrap > .ant-spin-container::-webkit-scrollbar-thumb) {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

:deep(.datasource-table) {
  flex: none;
  display: block;
  min-height: auto;
  overflow: visible;
}

:deep(.datasource-table .ant-spin-nested-loading),
:deep(.datasource-table .ant-spin-container),
:deep(.datasource-table .ant-table) {
  display: block;
  min-height: auto;
  overflow: visible;
}

:deep(.datasource-table .ant-table-container) {
  min-height: auto;
  overflow-x: auto;
  overflow-y: visible;
}

:deep(.datasource-table .ant-table-content) {
  min-height: 0;
  overflow-y: visible !important;
}

.datasource-pagination-bar {
  flex: none;
  min-height: 60px;
  padding: 12px 0 16px;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: var(--card-bg, #ffffff);
}

.datasource-pagination-bar :deep(.ant-pagination) {
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 8px;
}

.datasource-pagination-bar :deep(.ant-pagination-total-text) {
  margin-right: auto;
  color: var(--text-muted);
  font-size: 13px;
}

.datasource-pagination-bar :deep(.ant-pagination-item),
.datasource-pagination-bar :deep(.ant-pagination-prev .ant-pagination-item-link),
.datasource-pagination-bar :deep(.ant-pagination-next .ant-pagination-item-link) {
  border-radius: 8px;
  border-color: transparent;
  background: transparent;
}

.datasource-pagination-bar :deep(.ant-pagination-item:hover),
.datasource-pagination-bar :deep(.ant-pagination-prev:hover .ant-pagination-item-link),
.datasource-pagination-bar :deep(.ant-pagination-next:hover .ant-pagination-item-link) {
  background: var(--hover-bg, rgba(0, 0, 0, 0.04));
}

.datasource-pagination-bar :deep(.ant-pagination-item-active) {
  background: var(--apple-blue, #0A84FF) !important;
  border-color: var(--apple-blue, #0A84FF) !important;
}

.datasource-pagination-bar :deep(.ant-pagination-item-active a) {
  color: #ffffff !important;
}

.datasource-name-cell {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.datasource-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 16%, transparent);
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  transition: opacity 0.2s, border-color 0.2s;
}

.datasource-avatar:hover {
  border-color: var(--apple-blue, #0A84FF);
}

.datasource-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-uploading {
  pointer-events: none;
  opacity: 0.6;
}

.icon-upload-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--apple-blue, #0A84FF);
}

.icon-hidden-input {
  display: none;
}

.datasource-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cell-title-edit {
  max-width: 100%;
  min-width: 0;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-main);
  cursor: text;
  text-align: left;
  font: inherit;
}

.cell-title-edit span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
}

.cell-title-edit svg {
  flex: none;
  color: var(--text-muted);
  font-size: 11px;
  opacity: 0;
  transform: translateX(-3px);
  transition: all 0.18s ease;
}

.cell-title-edit:hover span {
  color: var(--apple-blue, #0A84FF);
}

.cell-title-edit:hover svg {
  opacity: 1;
  transform: translateX(0);
  color: var(--apple-blue, #0A84FF);
}

.inline-title-input {
  width: 100%;
  max-width: 210px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 36%, transparent);
  border-radius: 9px;
  outline: none;
  background: var(--content-bg, #ffffff);
  color: var(--text-main);
  font-size: 14px;
  font-weight: 650;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
}

.cell-label {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-main);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cell-muted {
  font-size: 12px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.datasource-id-badge {
  max-width: 100%;
}

.time-cell {
  color: var(--text-muted);
  font-size: 13px;
  white-space: nowrap;
}

.spin {
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.drawer-title {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.drawer-title > span:last-child {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.drawer-title strong,
.drawer-title small {
  max-width: 390px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer-title strong {
  color: var(--text-main);
  font-size: 18px;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.drawer-title small {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.drawer-source-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--apple-blue, #0A84FF);
  background: linear-gradient(135deg, color-mix(in srgb, var(--apple-blue, #0A84FF) 18%, transparent), color-mix(in srgb, var(--apple-blue, #0A84FF) 8%, transparent));
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 20%, transparent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.drawer-source-icon:hover {
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--apple-blue, #0A84FF) 18%, transparent);
  transform: translateY(-1px);
}

.drawer-source-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==================== 属性配置统计卡片（苹果毛玻璃风格） ==================== */

.drawer-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-stat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 28px 16px 26px;
  border-radius: 18px;
  isolation: isolate;
  overflow: hidden;

  /* 毛玻璃基底层：局部亮点 + 整体半透明 */
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.28) 0%, transparent 100%),
    color-mix(in srgb, var(--card-bg, #ffffff) 68%, transparent);

  /* 毛玻璃模糊 + 饱和度 */
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);

  /* 玻璃边缘：极细半透明边框 */
  border: 0.5px solid rgba(0, 0, 0, 0.09);

  /* 多层深度阴影系统 */
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.03),
    0 2px 6px rgba(0, 0, 0, 0.03),
    0 8px 22px rgba(0, 0, 0, 0.05),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.55),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.03);

  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* 玻璃表面左上角斜向光斑 */
.summary-stat::before {
  content: '';
  position: absolute;
  top: -35%;
  left: -25%;
  width: 70%;
  height: 70%;
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.18) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

/* 玻璃边缘光折射渐变 */
.summary-stat::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.08) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.02) 100%
  );
  pointer-events: none;
  z-index: 0;
}

/* hover：玻璃接更多光，轻微抬起 */
.summary-stat:hover {
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 12px 30px rgba(0, 0, 0, 0.08),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.6),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.02);
  transform: translateY(-2px);
}

.summary-stat:hover::before {
  opacity: 0.7;
}

.summary-stat-value {
  position: relative;
  z-index: 1;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}

/* 字段数量 — 苹果蓝点缀 */
.summary-stat:first-child .summary-stat-value {
  color: color-mix(in srgb, var(--apple-blue, #0A84FF) 85%, var(--text-main));
}

/* 类型数量 — 紫色点缀 */
.summary-stat:last-child .summary-stat-value {
  color: color-mix(in srgb, #7C4DFF 85%, var(--text-main));
}

/* 数值下方淡色光晕 */
.summary-stat-value::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 75%;
  height: 16px;
  background: radial-gradient(ellipse, color-mix(in srgb, currentColor 10%, transparent), transparent);
  border-radius: 50%;
  z-index: -1;
  pointer-events: none;
}

.summary-stat-label {
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

/* ==================== 属性列表 ==================== */

:deep(.property-spin),
:deep(.property-spin > .ant-spin-container) {
  min-height: 280px;
}

.property-config-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  isolation: isolate;

  /* 毛玻璃基底层：局部亮点 + 整体半透明 */
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.28) 0%, transparent 100%),
    color-mix(in srgb, var(--card-bg, #ffffff) 68%, transparent);

  /* 毛玻璃模糊 + 饱和度 */
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);

  /* 玻璃边缘：极细半透明边框 */
  border: 0.5px solid rgba(0, 0, 0, 0.09);

  /* 多层深度阴影系统 */
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.03),
    0 2px 6px rgba(0, 0, 0, 0.03),
    0 8px 22px rgba(0, 0, 0, 0.05),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.55),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.03);
}

/* 玻璃表面左上角斜向光斑 */
.property-config-card::before {
  content: '';
  position: absolute;
  top: -35%;
  left: -25%;
  width: 70%;
  height: 70%;
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.18) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

/* 玻璃边缘光折射渐变 */
.property-config-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.08) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.02) 100%
  );
  pointer-events: none;
  z-index: 0;
}

.property-config-head {
  min-height: 104px;
  padding: 28px 20px 20px;
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid var(--border-color);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--layout-bg, #f5f5f7) 36%, transparent), transparent);
}

.property-config-head div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.property-config-head strong {
  color: var(--text-main);
  font-size: 21px;
  font-weight: 800;
  line-height: 1.2;
}

.property-config-head span {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 14px 18px 0;
}

.property-item {
  position: relative;
  min-height: 66px;
  padding: 14px 34px 14px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.09);
  box-sizing: border-box;
}

.property-type-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--type-text);
  background: linear-gradient(
    135deg,
    var(--type-bg, #f5f5f5) 0%,
    color-mix(in srgb, var(--type-bg, #f5f5f5) 55%, #ffffff) 100%
  );
  border: 0.5px solid color-mix(in srgb, currentColor 18%, transparent);
  box-shadow:
    0 1px 4px color-mix(in srgb, currentColor 10%, transparent),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.7);
  font-size: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.property-item:hover .property-type-icon {
  transform: scale(1.08);
  box-shadow:
    0 2px 8px color-mix(in srgb, currentColor 14%, transparent),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.85);
}

.property-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.property-main strong,
.property-main small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-main strong {
  color: var(--text-main);
  font-size: 16px;
  font-weight: 760;
  line-height: 1.25;
}

/* 属性名编辑按钮复用标题编辑样式，稍作尺寸适配 */
.property-name-btn {
  width: 100%;
  height: auto;
  line-height: 1.25;
}
.property-name-btn span {
  font-size: 16px;
  font-weight: 760;
}
.property-name-btn svg {
  font-size: 13px;
}

/* 属性名编辑输入框复用标题输入框样式，宽度撑满 */
.property-main .inline-title-input {
  width: 100%;
  max-width: none;
}

/* 属性类型下拉选择 — a-select */
.property-type-select {
  min-width: 130px;
  height: 30px;
}
.property-type-select :deep(.ant-select-selector) {
  height: 30px !important;
  min-height: 30px !important;
  padding: 0 24px 0 10px !important;
  border: 1px solid color-mix(in srgb, var(--apple-blue, #0A84FF) 36%, transparent) !important;
  border-radius: 9px !important;
  background: var(--content-bg, #ffffff) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent) !important;
  transition: box-shadow 0.18s ease, border-color 0.18s ease !important;
  display: flex !important;
  align-items: center !important;
}
.property-type-select :deep(.ant-select-selector:hover) {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 18%, transparent) !important;
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 60%, transparent) !important;
}
.property-type-select :deep(.ant-select-selection-item) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 13px !important;
  color: var(--text-muted) !important;
  line-height: 28px !important;
  display: flex !important;
  align-items: center !important;
}
.property-type-select :deep(.ant-select-selection-placeholder) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  font-size: 13px !important;
  color: var(--text-muted, #a1a1aa) !important;
}
.property-type-select :deep(.ant-select-arrow) {
  right: 8px !important;
  font-size: 11px !important;
  color: var(--text-muted) !important;
}

.property-main small {
  color: var(--text-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

/* 属性类型可点击标签 */
.property-type-label.is-editable {
  cursor: pointer;
  transition: color 0.15s;
}
.property-type-label.is-editable:hover {
  color: var(--apple-blue, #0A84FF);
}

/* ==================== 拖拽手柄 ==================== */
.property-drag-handle {
  flex: none;
  width: 22px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  color: var(--text-muted, #a1a1aa);
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.15s ease;
  user-select: none;
  -webkit-user-select: none;
}
.property-item:hover .property-drag-handle {
  opacity: 0.48;
}
.property-item:hover .property-drag-handle:hover {
  opacity: 1;
  color: var(--text-main, #1d1d1f);
}

/* 拖拽状态 */
.property-item.is-dragging {
  opacity: 0.4;
}
.property-item.is-drag-over {
  border-bottom: 2px solid var(--apple-blue, #0A84FF);
}

/* ==================== 添加属性容器 ==================== */
.property-add-section {
  padding: 0 18px 24px;
  display: flex;
  flex-direction: column;
}

/* ==================== 添加属性 — 触发行 ==================== */
.property-add-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 36px;
  padding: 0 14px;
  margin: 24px auto 2px;
  width: fit-content;
  cursor: pointer;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 650;
  white-space: nowrap;
  background: #1d1d1f;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s;
  user-select: none;
}
.property-add-trigger:hover {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}
.property-add-trigger:focus-visible {
  outline: 2px solid var(--apple-blue, #0A84FF);
  outline-offset: 2px;
  border-radius: 12px;
}
.property-add-trigger-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.property-add-trigger-text {
  font-size: 14px;
  font-weight: 650;
}

/* ==================== 添加属性 — 表单行 ==================== */
.property-add-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  background: var(--content-bg, #ffffff);
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 14px;
  animation: addFormIn 0.25s ease;
}
@keyframes addFormIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.property-add-form-icon {
  color: var(--apple-blue, #0A84FF);
  font-size: 18px;
}
.property-add-form-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.property-add-form-name {
  height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  outline: none;
  background: var(--add-form-bg, #ffffff);
  color: var(--text-main);
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.property-add-form-name::placeholder {
  color: #a1a1aa;
  opacity: 1;
}
.property-add-form-name:focus {
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent);
}
.property-add-form-type {
  min-width: 0;
  height: 36px;
}
.property-add-form-type :deep(.ant-select-selector) {
  height: 36px !important;
  min-height: 36px !important;
  padding: 0 26px 0 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-radius: 10px !important;
  background: var(--add-form-bg, #ffffff) !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
}
.property-add-form-type :deep(.ant-select-selector:hover) {
  border-color: rgba(0, 0, 0, 0.24) !important;
}
/* 聚焦状态与名称输入框一致 */
.property-add-form-type :deep(.ant-select-focused .ant-select-selector) {
  border-color: var(--apple-blue, #0A84FF) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 12%, transparent) !important;
}
.property-add-form-type :deep(.ant-select-selection-item) {
  font-size: 14px !important;
  color: var(--text-main) !important;
  line-height: 34px !important;
}
.property-add-form-type :deep(.ant-select-selection-placeholder) {
  font-size: 14px !important;
  color: #a1a1aa !important;
}
.property-add-form-type :deep(.ant-select-arrow) {
  font-size: 11px !important;
  color: var(--text-muted) !important;
}

/* select 下拉面板背景与输入框一致 */
.property-add-form-fields :deep(.ant-select-dropdown) {
  background: var(--add-form-bg, #ffffff) !important;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}
.property-add-form-fields :deep(.ant-select-item-option) {
  font-size: 14px;
  color: var(--text-muted);
  transition: background 0.15s;
}
.property-add-form-fields :deep(.ant-select-item-option-active) {
  background: rgba(0, 0, 0, 0.04);
}
.property-add-form-fields :deep(.ant-select-item-option-selected) {
  font-weight: 600;
  color: var(--text-main);
  background: rgba(0, 0, 0, 0.06);
}

/* ==================== 添加属性 — 选项配置 ==================== */
.add-option-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 0 4px 0;
  margin-top: 2px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.add-option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 6px 14px;
  border-radius: 10px;
  background: var(--add-form-bg, #ffffff);
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.add-option-row:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.14),
    0 4px 14px rgba(0,0,0,0.06);
}
.add-option-row.is-removed {
  opacity: 0.5;
  pointer-events: auto;
}
.add-option-row.is-removed .add-option-name.display {
  text-decoration: line-through;
}
.add-option-row.is-removed:hover {
  transform: none;
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0,0,0,0.04);
}
.add-option-color-palette {
  display: flex;
  gap: 3px;
  flex: none;
  padding: 1px;
  align-self: center;
}
.add-option-swatch {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  flex: none;
  box-sizing: border-box;
}
.add-option-swatch:hover {
  transform: scale(1.25);
  border-color: rgba(0, 0, 0, 0.15);
}
.add-option-swatch.active {
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--apple-blue, #0A84FF) 22%, transparent);
  transform: scale(1.15);
}
.add-option-name {
  flex: 1;
  min-width: 0;
  height: auto;
  padding: 4px 0;
  border: none;
  border-radius: 0;
  outline: none;
  background: transparent;
  color: var(--text-main);
  font-size: 13px;
  font-weight: 650;
  font-family: inherit;
  line-height: 1.3;
}
.add-option-name::placeholder {
  color: #a1a1aa;
  opacity: 1;
}
.add-option-name.display {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.option-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
  padding-left: 4px;
}
.add-option-desc {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
html.dark .add-option-desc {
  color: rgba(255, 255, 255, 0.3);
}
.option-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.add-option-desc-input {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.55);
}
.add-option-desc-input::placeholder {
  color: #c0c0c4;
  opacity: 1;
}
html.dark .add-option-desc-input {
  color: rgba(255, 255, 255, 0.5);
}
html.dark .add-option-desc-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}
.add-option-remove {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
  flex: none;
  align-self: center;
}
.add-option-remove:hover:not(:disabled) {
  background: rgba(255, 69, 58, 0.12);
  color: #ff453a;
}
.add-option-remove:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.add-option-btn {
  height: 32px;
  padding: 0 14px;
  margin-top: 14px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: var(--add-form-bg, #ffffff);
  color: var(--text-secondary, #6e6e73);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s;
  align-self: flex-start;
}
.add-option-btn:hover:not(:disabled) {
  border-color: var(--apple-blue, #0A84FF);
  color: var(--apple-blue, #0A84FF);
  background: color-mix(in srgb, var(--apple-blue, #0A84FF) 6%, transparent);
  transform: translateY(-1px);
}
.add-option-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.property-add-form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}

/* 添加按钮 — 与触发按钮/同步按钮风格一致 */
.property-add-form-save {
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  white-space: nowrap;
  background: #1d1d1f;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: all 0.2s;
}
.property-add-form-save:hover:not(:disabled) {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}
.property-add-form-save:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.property-add-form-save:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 取消按钮 — Apple 文字链接风格 */
.property-add-form-cancel {
  height: 36px;
  padding: 0 12px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  color: var(--text-muted);
  transition: color 0.2s ease;
}
.property-add-form-cancel:hover:not(:disabled) {
  color: var(--text-main);
}

/* 选项配置按钮（属性项后方） */
.property-option-btn {
  height: 32px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: transparent;
  color: var(--text-main);
  flex: none;
  transition: all 0.2s;
}

.property-option-btn:hover {
  background: var(--card-bg);
  border-color: color-mix(in srgb, var(--text-main) 20%, transparent);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.property-option-btn.is-expanded {
  background: color-mix(in srgb, var(--text-main) 6%, transparent);
  border-color: color-mix(in srgb, var(--text-main) 25%, transparent);
}

.property-delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex: none;
  transition: all 0.2s;
}
.property-delete-btn:hover {
  background: rgba(255, 69, 58, 0.12);
  color: #FF453A;
}

/* ==================== 选项标签 ==================== */

.option-chip {
  height: 28px;
  padding: 0 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--opt-text);
  background: var(--opt-bg);
  border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
  font-size: 12px;
  font-weight: 650;
  line-height: 1;
  white-space: nowrap;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.option-chip::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
  background: currentColor;
}

.option-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px color-mix(in srgb, currentColor 22%, transparent);
}

/* ==================== 属性选项内联展开 ==================== */

.property-options-expand {
  padding: 10px 34px 12px 34px;
  overflow: hidden;
}

.expand-option-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.expand-option-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
}

.property-confirm-btn,
.property-cancel-btn {
  padding: 6px 16px;
  border-radius: 8px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.property-confirm-btn {
  background: #1d1d1f;
  color: #fff;
}
.property-confirm-btn:hover:not(:disabled) {
  filter: brightness(1.08);
}
.property-confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:global(html.dark .property-confirm-btn) {
  background: #fff;
  color: #1d1d1f;
}
:global(html.dark .property-confirm-btn:hover:not(:disabled)) {
  filter: brightness(0.92);
}

.property-cancel-btn {
  background: var(--subtle-gray, rgba(0, 0, 0, 0.06));
  color: var(--text-secondary, #666);
}
.property-cancel-btn:hover:not(:disabled) {
  background: var(--subtle-gray-hover, rgba(0, 0, 0, 0.1));
}
.property-cancel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.expand-relation-config {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.expand-relation-config :deep(.property-add-form-type) {
  width: 100%;
}
.expand-relation-config :deep(.property-add-form-name) {
  width: 100%;
  max-width: none;
}

.prefix-config-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  background: var(--add-form-bg, #ffffff);
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.08);
}
.prefix-config-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex: none;
}
.prefix-config-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
  font-family: 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
}
.prefix-config-value.is-empty {
  color: var(--text-muted);
  font-family: inherit;
  font-weight: 400;
}

/* 关联配置只读展示 */
.relation-readonly-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  background: var(--add-form-bg, #ffffff);
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.08);
}
.relation-readonly-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  flex: none;
}
.relation-readonly-value {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
}
.relation-readonly-value.is-empty {
  color: var(--text-muted);
  font-weight: 400;
}

.detail-option-pill {
  width: 100%;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: none;
  box-sizing: border-box;
  box-shadow:
    inset 0 0 0 0.5px color-mix(in srgb, currentColor 14%, transparent),
    0 1px 3px rgba(0,0,0,0.04);
  animation: detailOptionIn 0.25s ease both;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  cursor: default;
}

.detail-option-pill:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 0.5px color-mix(in srgb, currentColor 20%, transparent),
              0 4px 14px color-mix(in srgb, currentColor 16%, transparent),
              0 8px 24px rgba(0,0,0,0.06);
}

.detail-option-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: currentColor;
  flex: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 14%, transparent);
}

.detail-option-name {
  min-width: 0;
  flex: 1;
  color: currentColor;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes detailOptionIn {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ==================== 空状态 ==================== */

.property-empty {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

/* ==================== Drawer 全局覆盖 ==================== */

:deep(.ant-drawer-content),
:deep(.ant-drawer-header),
:deep(.ant-drawer-body) {
  background: var(--layout-bg, #f5f5f7);
}

:deep(.ant-drawer-header) {
  padding: 18px 22px 16px;
  border-bottom-color: var(--border-color);
}

:deep(.ant-drawer-body) {
  padding: 20px 22px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

:deep(.datasource-property-drawer .ant-drawer-content) {
  border-left: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.04);
}

:global(.dark) .neo-sidebar,
:global(.dark) .neo-main {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.06);
}

:global(.dark) .capsule-search {
  background: var(--card-bg, #1e1e1c);
  border-color: rgba(255, 255, 255, 0.06);
}

:global(.dark) .capsule-search:focus-within {
  background: var(--card-bg, #1e1e1c);
  border-color: var(--apple-blue, #0A84FF);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 14%, transparent);
}

:global(.dark) .modern-empty-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Drawer 内空状态暗黑适配（drawer teleport 到 body，脱离 .apple-layout-root 的 CSS 变量） */
:global(html.dark .datasource-property-drawer .neo-empty-state) {
  background:
    radial-gradient(circle at top right, rgba(10, 132, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at bottom left, rgba(10, 132, 255, 0.02) 0%, transparent 50%);
}
:global(html.dark .datasource-property-drawer .modern-empty-card) {
  background: #1e1e1c;
  border-color: rgba(255, 255, 255, 0.07);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
:global(html.dark .datasource-property-drawer .modern-empty-title) {
  color: rgba(255, 255, 255, 0.92);
}
:global(html.dark .datasource-property-drawer .modern-empty-desc) {
  color: rgba(255, 255, 255, 0.48);
}
:global(html.dark .datasource-property-drawer .mockup-window) {
  background: #252523;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
}
:global(html.dark .datasource-property-drawer .mockup-dot) {
  background: rgba(255, 255, 255, 0.07);
}
:global(html.dark .datasource-property-drawer .mockup-line) {
  background: rgba(255, 255, 255, 0.06);
}
:global(html.dark .datasource-property-drawer .mockup-star) {
  color: rgba(255, 255, 255, 0.07);
}
:global(html.dark .datasource-property-drawer .mockup-avatar) {
  background: rgba(255, 255, 255, 0.06);
}

:global(.dark) .summary-stat,
:global(.theme-dark) .summary-stat {
  /* 更高级的暗色玻璃：高不透明度避免透底泛白，深色基调 */
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%),
    color-mix(in srgb, var(--card-bg, #1c1c1e) 90%, transparent);

  /* 暗色玻璃边缘：极细淡白边框 */
  border-color: rgba(255, 255, 255, 0.05);

  /* 深色高级阴影体系 */
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.03),
    0 2px 8px rgba(0,0,0,0.3),
    0 8px 28px rgba(0,0,0,0.35),
    inset 0 0.5px 0 rgba(255,255,255,0.04),
    inset 0 -0.5px 0 rgba(0,0,0,0.25);
}
:global(.dark) .summary-stat::before,
:global(.theme-dark) .summary-stat::before {
  /* 暗色下减弱光斑，避免泛白感 */
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
}
:global(.dark) .summary-stat::after,
:global(.theme-dark) .summary-stat::after {
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.02) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.08) 100%
  );
}
:global(.dark) .summary-stat:hover,
:global(.theme-dark) .summary-stat:hover {
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04),
    0 4px 14px rgba(0,0,0,0.35),
    0 14px 36px rgba(0,0,0,0.4),
    inset 0 0.5px 0 rgba(255,255,255,0.06),
    inset 0 -0.5px 0 rgba(0,0,0,0.2);
}
:global(.dark) .summary-stat:first-child .summary-stat-value,
:global(.theme-dark) .summary-stat:first-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}
:global(.dark) .summary-stat:last-child .summary-stat-value,
:global(.theme-dark) .summary-stat:last-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}

:global(.dark) .summary-stat-label,
:global(.theme-dark) .summary-stat-label {
  color: rgba(255, 255, 255, 0.48);
}

:global(.dark) .property-config-card,
:global(.theme-dark) .property-config-card {
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%),
    color-mix(in srgb, var(--card-bg, #1c1c1e) 90%, transparent);
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.03),
    0 2px 8px rgba(0,0,0,0.3),
    0 8px 28px rgba(0,0,0,0.35),
    inset 0 0.5px 0 rgba(255,255,255,0.04),
    inset 0 -0.5px 0 rgba(0,0,0,0.25);
}
:global(.dark) .property-config-card::before,
:global(.theme-dark) .property-config-card::before {
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
}
:global(.dark) .property-config-card::after,
:global(.theme-dark) .property-config-card::after {
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.02) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.08) 100%
  );
}

:global(.dark) .property-item,
:global(.theme-dark) .property-item {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

:global(.dark) .property-config-head,
:global(.theme-dark) .property-config-head {
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--apple-blue, #0A84FF) 4%, transparent), transparent);
}

:global(.dark) .mockup-window {
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
}

:global(.dark) .search-trigger.reset-btn,
:global(.dark) .page-btn {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.72);
}

:global(html.dark .neo-datasource-container .sync-action-btn),
:global(.theme-dark .neo-datasource-container .sync-action-btn),
:global(.dark .neo-datasource-container .sync-action-btn) {
  background: #ffffff !important;
  color: #1d1d1f !important;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}

:global(html.dark .neo-datasource-container .sync-action-btn:hover:not(:disabled)),
:global(.theme-dark .neo-datasource-container .sync-action-btn:hover:not(:disabled)),
:global(.dark .neo-datasource-container .sync-action-btn:hover:not(:disabled)) {
  background: #f5f5f7 !important;
  color: #000000 !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

:global(.dark) .page-btn:disabled {
  background: rgba(255, 255, 255, 0.02);
}

/* 暗黑模式：添加属性按钮 & 选项配置按钮 */
:global(.dark) .property-add-btn,
:global(.theme-dark) .property-add-btn {
  background: #ffffff !important;
  color: #1d1d1f !important;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}

:global(.dark) .property-add-btn:hover:not(:disabled),
:global(.theme-dark) .property-add-btn:hover:not(:disabled) {
  background: #f5f5f7 !important;
  color: #000000 !important;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

:global(.dark) .property-option-btn,
:global(.theme-dark) .property-option-btn {
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}

:global(.dark) .property-option-btn:hover,
:global(.theme-dark) .property-option-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.24);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

@media (max-width: 1180px) {
  .neo-datasource-container {
    gap: 18px;
  }

  .neo-sidebar {
    width: 320px;
  }

  .data-capsule {
    min-width: 360px;
  }
}

@media (max-width: 900px) {
  .neo-datasource-container {
    height: auto;
    min-height: calc(100vh - 120px);
    flex-direction: column;
  }

  .neo-sidebar {
    width: 100%;
    max-height: 420px;
  }

  .neo-main {
    min-height: 620px;
  }

  .data-toolbar {
    flex-wrap: wrap;
  }

  .data-capsule {
    min-width: 0;
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 640px) {
  .data-header,
  .data-toolbar,
  .data-table-wrapper {
    padding-left: 20px;
    padding-right: 20px;
  }

  .drawer-summary {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- 非 scoped：Drawer 滚动条伪元素在 Vue 3 scoped :deep() 中可能编译异常 -->
<style>
.datasource-property-drawer .ant-drawer-body {
  scrollbar-width: thin;
  scrollbar-color: var(--border-color, rgba(0,0,0,0.08)) transparent;
}
.datasource-property-drawer .ant-drawer-body::-webkit-scrollbar {
  width: 4px;
}
.datasource-property-drawer .ant-drawer-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

/* ========== 暗黑模式统计卡（非 scoped，显式色值，确保 Drawer 内生效） ========== */
html.dark .summary-stat {
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%),
    #1c1c1e !important;
  border-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.03),
    0 2px 8px rgba(0,0,0,0.3),
    0 8px 28px rgba(0,0,0,0.35),
    inset 0 0.5px 0 rgba(255,255,255,0.04),
    inset 0 -0.5px 0 rgba(0,0,0,0.25) !important;
}
html.dark .summary-stat::before {
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
}
html.dark .summary-stat::after {
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.02) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.08) 100%
  );
}
html.dark .summary-stat:hover {
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04),
    0 4px 14px rgba(0,0,0,0.35),
    0 14px 36px rgba(0,0,0,0.4),
    inset 0 0.5px 0 rgba(255,255,255,0.06),
    inset 0 -0.5px 0 rgba(0,0,0,0.2) !important;
}
html.dark .summary-stat:first-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .summary-stat:last-child .summary-stat-value {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .summary-stat-label {
  color: rgba(255, 255, 255, 0.48);
}

/* 暗黑模式：属性卡片文本色彩（显式色值，确保 Drawer teleport 场景生效） */
html.dark .property-config-card {
  background:
    radial-gradient(ellipse 90% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%),
    #1c1c1e !important;
  border-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.03),
    0 2px 8px rgba(0,0,0,0.3),
    0 8px 28px rgba(0,0,0,0.35),
    inset 0 0.5px 0 rgba(255,255,255,0.04),
    inset 0 -0.5px 0 rgba(0,0,0,0.25) !important;
}
html.dark .property-config-card::before {
  background: radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.03) 0%, transparent 70%);
}
html.dark .property-config-card::after {
  background: linear-gradient(
    140deg,
    rgba(255,255,255,0.02) 0%,
    transparent 35%,
    transparent 65%,
    rgba(0,0,0,0.08) 100%
  );
}
html.dark .property-item {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}
html.dark .property-main strong {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .property-main small {
  color: rgba(255, 255, 255, 0.48);
}
html.dark .property-name-btn,
html.dark .property-name-btn span {
  color: rgba(255, 255, 255, 0.85);
}
html.dark .property-name-btn:hover span {
  color: var(--apple-blue, #4DA6FF);
}
html.dark .property-name-btn svg {
  color: rgba(255, 255, 255, 0.38);
}
html.dark .property-name-btn:hover svg {
  color: var(--apple-blue, #4DA6FF);
}
html.dark .property-main .inline-title-input {
  background: #2c2c2e;
  color: rgba(255, 255, 255, 0.92);
}
html.dark .property-type-select .ant-select-selector {
  background: #2c2c2e !important;
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 38%, transparent) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 14%, transparent) !important;
}
html.dark .property-type-select .ant-select-selector:hover {
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 64%, transparent) !important;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 22%, transparent) !important;
}
html.dark .property-type-select .ant-select-selection-item {
  color: rgba(255, 255, 255, 0.56) !important;
}
html.dark .property-drag-handle {
  color: rgba(255, 255, 255, 0.24);
}
html.dark .property-item:hover .property-drag-handle:hover {
  color: rgba(255, 255, 255, 0.85);
}
html.dark .property-item.is-drag-over {
  border-bottom-color: var(--apple-blue, #4DA6FF);
}

html.dark .property-add-trigger {
  background: #ffffff;
  color: #1d1d1f;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}
html.dark .property-add-trigger:hover {
  background: #f5f5f7;
  color: #000000;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}
html.dark .property-add-trigger-icon {
  background: transparent;
}
html.dark .property-add-trigger:hover .property-add-trigger-icon {
  background: color-mix(in srgb, var(--apple-blue, #4DA6FF) 12%, transparent);
}

html.dark .property-add-form {
  background: #2c2c2e;
  border-color: rgba(255, 255, 255, 0.06);
}
html.dark .property-add-form-icon {
  color: #ffffff;
}
html.dark .property-add-form-name {
  border-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.92);
}
html.dark .property-add-form-name::placeholder {
  color: rgba(255, 255, 255, 0.35);
  opacity: 1;
}
html.dark .property-add-form-name:focus {
  border-color: var(--apple-blue, #4DA6FF);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #4DA6FF) 10%, transparent);
}
html.dark .property-add-form-type .ant-select-selector {
  border-color: rgba(255, 255, 255, 0.08) !important;
}
html.dark .property-add-form-type .ant-select-selector:hover {
  border-color: rgba(255, 255, 255, 0.18) !important;
}
html.dark .property-add-form-type.ant-select-focused .ant-select-selector {
  border-color: var(--apple-blue, #4DA6FF) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #4DA6FF) 10%, transparent) !important;
}
html.dark .property-add-form-type .ant-select-selection-placeholder {
  color: rgba(255, 255, 255, 0.35) !important;
}
html.dark .property-add-form-save {
  background: #ffffff;
  color: #1d1d1f;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}
html.dark .property-add-form-save:hover:not(:disabled) {
  background: #f5f5f7;
  color: #000000;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

/* 暗色 — 添加属性选项配置 */
html.dark .add-option-label {
  color: rgba(255, 255, 255, 0.48);
  border-top-color: rgba(255, 255, 255, 0.08);
}
html.dark .add-option-row {
  background: var(--add-form-bg, #3a3a3c);
  box-shadow:
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.06),
    0 1px 3px rgba(0,0,0,0.2);
}
html.dark .add-option-row:hover {
  box-shadow:
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.12),
    0 4px 14px rgba(0,0,0,0.25);
}
html.dark .add-option-row.is-removed {
  opacity: 0.4;
}
html.dark .add-option-row.is-removed:hover {
  box-shadow:
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.06),
    0 1px 3px rgba(0,0,0,0.2);
}
html.dark .add-option-swatch {
  border-color: rgba(255, 255, 255, 0.15);
}
html.dark .add-option-swatch:hover {
  border-color: rgba(255, 255, 255, 0.45);
}
html.dark .add-option-swatch.active {
  border-color: var(--apple-blue, #4DA6FF);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--apple-blue, #4DA6FF) 22%, transparent);
}
html.dark .add-option-name {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .add-option-name::placeholder {
  color: rgba(255, 255, 255, 0.35);
  opacity: 1;
}
html.dark .add-option-btn {
  border-color: rgba(255, 255, 255, 0.1);
  background: #2c2c2e;
  color: rgba(255, 255, 255, 0.55);
}
html.dark .add-option-btn:hover:not(:disabled) {
  border-color: var(--apple-blue, #4DA6FF);
  color: var(--apple-blue, #4DA6FF);
  background: color-mix(in srgb, var(--apple-blue, #4DA6FF) 8%, transparent);
}
html.dark .add-option-remove {
  color: rgba(255, 255, 255, 0.65);
}
html.dark .add-option-remove:hover:not(:disabled) {
  background: rgba(255, 69, 58, 0.15);
  color: #ff453a;
}

html.dark .prefix-config-row {
  background: var(--add-form-bg, #3a3a3c);
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.06);
}
html.dark .prefix-config-label {
  color: rgba(255, 255, 255, 0.48);
}
html.dark .prefix-config-value {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .prefix-config-value.is-empty {
  color: rgba(255, 255, 255, 0.35);
}

html.dark .relation-readonly-row {
  background: var(--add-form-bg, #3a3a3c);
  box-shadow: inset 0 0 0 0.5px rgba(255, 255, 255, 0.06);
}
html.dark .relation-readonly-label {
  color: rgba(255, 255, 255, 0.48);
}
html.dark .relation-readonly-value {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .relation-readonly-value.is-empty {
  color: rgba(255, 255, 255, 0.35);
}

html.dark .property-add-form-cancel {
  color: rgba(255, 255, 255, 0.42);
}
html.dark .property-add-form-cancel:hover:not(:disabled) {
  color: rgba(255, 255, 255, 0.85);
}
html.dark .property-option-btn {
  border-color: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
}
html.dark .property-option-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.24);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
html.dark .property-delete-btn {
  color: rgba(255, 255, 255, 0.48);
}
html.dark .property-delete-btn:hover {
  background: rgba(255, 69, 58, 0.15);
  color: #FF453A;
}
html.dark .property-item {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}
html.dark .property-main strong {
  color: rgba(255, 255, 255, 0.92);
}
html.dark .property-main small {
  color: rgba(255, 255, 255, 0.48);
}
html.dark .property-name-btn,
html.dark .property-name-btn span {
  color: rgba(255, 255, 255, 0.85);
}
html.dark .property-name-btn:hover span {
  color: var(--apple-blue, #4DA6FF);
}
html.dark .property-name-btn svg {
  color: rgba(255, 255, 255, 0.38);
}
html.dark .property-name-btn:hover svg {
  color: var(--apple-blue, #4DA6FF);
}
html.dark .property-main .inline-title-input {
  background: #2c2c2e;
  color: rgba(255, 255, 255, 0.92);
}
html.dark .property-type-select .ant-select-selector {
  background: #2c2c2e !important;
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 38%, transparent) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--apple-blue, #0A84FF) 14%, transparent) !important;
}
html.dark .property-type-select .ant-select-selector:hover {
  border-color: color-mix(in srgb, var(--apple-blue, #0A84FF) 64%, transparent) !important;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--apple-blue, #0A84FF) 22%, transparent) !important;
}
html.dark .property-type-select .ant-select-selection-item {
  color: rgba(255, 255, 255, 0.56) !important;
}
html.dark .property-add-btn {
  background: #ffffff;
  color: #1d1d1f;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.08);
}
html.dark .property-add-btn:hover:not(:disabled) {
  background: #f5f5f7;
  color: #000000;
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.12);
}

/* 选择器背景与名称输入框一致 — 通过自定义属性保证两者始终相同 */
.property-add-form {
  --add-form-bg: #ffffff;
}
.dark .property-add-form {
  --add-form-bg: #3a3a3c;
}
.property-add-form-name {
  background: var(--add-form-bg) !important;
}
.property-add-form-type.ant-select:not(.ant-select-customize-input) .ant-select-selector {
  background: var(--add-form-bg) !important;
}

/* 添加属性表单 — 下拉面板（通过 dropdown-class-name 绑定，不受 scoped 限制） */
.property-add-form-dropdown {
  background: #ffffff !important;
  border: 1px solid rgba(0, 0, 0, 0.09);
  border-radius: 10px !important;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}
.property-add-form-dropdown .ant-select-item-option {
  font-size: 14px;
  color: #a1a1aa;
}
.property-add-form-dropdown .ant-select-item-option-active {
  background: rgba(0, 0, 0, 0.04);
}
.property-add-form-dropdown .ant-select-item-option-selected {
  font-weight: 600;
  color: #1d1d1f;
  background: rgba(0, 0, 0, 0.06);
}
html.dark .property-add-form-dropdown {
  background: #3a3a3c !important;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
}
html.dark .property-add-form-dropdown .ant-select-item-option {
  color: rgba(255, 255, 255, 0.48);
}
html.dark .property-add-form-dropdown .ant-select-item-option-active {
  background: rgba(255, 255, 255, 0.06);
}
html.dark .property-add-form-dropdown .ant-select-item-option-selected {
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.1);
}

/* ===== 下拉面板滚动条（挂载到 body，需在非 scoped 块中定义） ===== */
.property-add-form-dropdown,
.property-type-select-dropdown {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
}
.property-add-form-dropdown::-webkit-scrollbar,
.property-type-select-dropdown::-webkit-scrollbar {
  width: 4px;
}
.property-add-form-dropdown::-webkit-scrollbar-thumb,
.property-type-select-dropdown::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.property-add-form-dropdown::-webkit-scrollbar-track,
.property-type-select-dropdown::-webkit-scrollbar-track {
  background: transparent;
}
html.dark .property-add-form-dropdown,
html.dark .property-type-select-dropdown {
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
}
html.dark .property-add-form-dropdown::-webkit-scrollbar-thumb,
html.dark .property-type-select-dropdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
}

/* ===== 下拉加载中骨架屏（挂载到 body，需在非 scoped 块中定义） ===== */
.select-loading-state {
  position: relative;
  overflow: hidden;
}
.select-loading-shimmer {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--apple-blue, #007aff) 50%,
    transparent 100%
  );
  animation: select-shimmer-slide 1.2s ease-in-out infinite;
  opacity: 0.5;
}
@keyframes select-shimmer-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.select-loading-skeleton {
  padding: 8px 12px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton-row {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  animation: skeleton-fade-in 0.3s ease-out forwards;
  opacity: 0;
}
@keyframes skeleton-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.skeleton-bar {
  display: block;
  height: 12px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.06);
  animation: skeleton-shine 1.6s ease-in-out infinite;
}
.skeleton-row:nth-child(1) .skeleton-bar { width: 72%; }
.skeleton-row:nth-child(2) .skeleton-bar { width: 58%; }
.skeleton-row:nth-child(3) .skeleton-bar { width: 65%; }
@keyframes skeleton-shine {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.select-loading-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px 14px;
  color: rgba(0, 0, 0, 0.35);
  font-size: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}
.select-loading-hint .fa-spinner {
  color: rgba(0, 0, 0, 0.25);
  font-size: 13px;
}
html.dark .select-loading-hint {
  color: rgba(255, 255, 255, 0.3);
  border-top-color: rgba(255, 255, 255, 0.05);
}
html.dark .select-loading-hint .fa-spinner {
  color: rgba(255, 255, 255, 0.2);
}
html.dark .skeleton-bar {
  background: rgba(255, 255, 255, 0.06);
}
</style>
