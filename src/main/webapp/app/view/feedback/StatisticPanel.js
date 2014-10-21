/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2014 The ARSnova Team
 *
 * ARSnova Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('ARSnova.view.feedback.StatisticPanel', {
	extend: 'Ext.Panel',

	requires: [
		'Ext.chart.series.Bar',
		'Ext.chart.axis.Numeric',
		'Ext.chart.axis.Category'
	],

	config: {
		title: 'StatisticPanel',
		style: 'background-color: black',
		layout: 'fit'
	},

	buttonClicked: null,
	feedbackChart: null,

	/* toolbar items */
	toolbar: null,

	initialize: function () {
		this.callParent(arguments);
		
		this.backButton = Ext.create('Ext.Button', {
			text: ARSnova.app.userRole === ARSnova.app.USER_ROLE_SPEAKER ? 
					Messages.HOME : Messages.FEEDBACK_VOTE,
			ui: 'back',
			handler: function() {
				var	tabPanel = ARSnova.app.mainTabPanel.tabPanel,
					feedbackTabPanel = tabPanel.feedbackTabPanel;
				
				if(ARSnova.app.userRole === ARSnova.app.USER_ROLE_SPEAKER) {
					tabPanel.animateActiveItem(tabPanel.speakerTabPanel, {
						type: 'slide',
						direction: 'right',
						duration: 700
					});
				} else {
					feedbackTabPanel.animateActiveItem(feedbackTabPanel.votePanel, {
						type: 'slide',
						direction: 'down',
						duration: 700
					});
				}
			}
		});

		if (ARSnova.app.userRole != ARSnova.app.USER_ROLE_SPEAKER) {
			this.buttonClicked = function (button) {
				ARSnova.app.getController('Feedback').vote({
					value: button.config.value
				});
			};
		}

		this.toolbar = Ext.create('Ext.Toolbar', {
			docked: 'top',
			ui: 'light',
			items: [this.backButton]
		});

		this.feedbackOkButton = Ext.create('Ext.Panel', {
			flex: 1,

			items: [{
				xtype: 'button',
				value: 'Kann folgen',
				//cls: 'feedbackOkIcon',
				cls: 'feedbackStatisticButton',
				iconCls: 'icon-happy',
				handler: this.buttonClicked
			}]
		});

		this.feedbackGoodButton = Ext.create('Ext.Panel', {
			cls: 'voteButtons',
			flex: 1,

			items: [{
				xtype: 'button',
				value: 'Bitte schneller',
				//cls: 'feedbackGoodIcon',
				cls: 'feedbackStatisticButton',
				iconCls: 'icon-wink',
				handler: this.buttonClicked
			}]
		});

		this.feedbackBadButton = Ext.create('Ext.Panel', {
			cls: 'voteButtons',
			flex: 1,

			items: [{
				xtype: 'button',
				value: 'Zu schnell',
				cls: 'feedbackStatisticButton',
				iconCls: 'icon-shocked',
				//cls: 'feedbackBadIcon',
				handler: this.buttonClicked
			}]
		});

		this.feedbackNoneButton = Ext.create('Ext.Panel', {
			cls: 'voteButtons',
			flex: 1,

			items: [{
				xtype: 'button',
				value: 'Nicht mehr dabei',
				cls: 'feedbackStatisticButton',
				iconCls: 'icon-sad',
				//cls: 'feedbackNoneIcon',
				handler: this.buttonClicked
			}]
		});

		this.feedbackButtons = Ext.create('Ext.Toolbar', {
			cls: 'voteButtonsPanel',
			docked: 'top',

			items: [
				this.feedbackOkButton,
				this.feedbackGoodButton,
				this.feedbackBadButton,
				this.feedbackNoneButton
			]
		});

		this.feedbackChartColors = [
			Ext.create('Ext.draw.gradient.Linear', {
				degrees: 90,
				stops: [{offset: 0, color: 'rgb(122, 184, 68)'},
						{offset: 100, color: 'rgb(82, 144, 28)'}
				]
			}),

			Ext.create('Ext.draw.gradient.Linear', {
				degrees: 90,
				stops: [
					{offset: 0, color: 'rgb(254, 201, 41)'},
					{offset: 100, color: 'rgb(214, 161, 0)'}
				]
			}),

			Ext.create('Ext.draw.gradient.Linear', {
				degrees: 90,
				stops: [
					{offset: 0, color: 'rgb(237, 96, 28)'},
					{offset: 100, color: 'rgb(197, 56, 0)'}
				]
			}),

			Ext.create('Ext.draw.gradient.Linear', {
				degrees: 90,
				stops: [
					{offset: 0, color: 'rgb(235, 235, 235)'},
					{offset: 100, color: 'rgb(195,195,195)'}
				]
			})
		];

		this.feedbackChart = Ext.create('Ext.chart.CartesianChart', {
			store: Ext.create('Ext.data.Store', {
				fields: ['name', 'displayName', 'value', 'percent'],
				data: [
					{'name': 'Kann folgen', 'displayName': Messages.FEEDBACK_OKAY, 'value': 0, 'percent': 0.0},
					{'name': 'Bitte schneller', 'displayName': Messages.FEEDBACK_GOOD, 'value': 0, 'percent': 0.0},
					{'name': 'Zu schnell', 'displayName': Messages.FEEDBACK_BAD, 'value': 0, 'percent': 0.0},
					{'name': 'Nicht mehr dabei', 'displayName': Messages.FEEDBACK_NONE, 'value': 0, 'percent': 0.0}
				]
			}),

			animate: {
				easing: 'bounceOut',
				duration: 750
			},

			axes: [{
				type: 'numeric',
				position: 'left',
				fields: ['value'],
				hidden: true
			}, {
				type: 'category',
				position: 'bottom',
				fields: ['name'],
				style: {stroke: 'white'},
				renderer: function (label, layout, lastLabel) {
					// remove x-axis ticks and labels on refresh or update
					layout.attr.majorTicks = false;
				}
			}],

			series: [{
				type: 'bar',
				xField: 'name',
				yField: 'value',
				style: {
					minGapWidth: 25,
					maxBarWidth: 200
				},
				label: {
					display: 'insideEnd',
					field: 'value',
					color: '#000',
					font: '20px Helvetica',
					orientation: 'horizontal',
					renderer: function (text) {
						return text;
					}
				},
				renderer: function (sprite, config, rendererData, i) {
					var panel = ARSnova.app.mainTabPanel.tabPanel.feedbackTabPanel.statisticPanel;

					return rendererData = {
						fill: panel.feedbackChartColors[i % panel.feedbackChartColors.length]
					};
				}
			}]
		});

		this.add([this.toolbar, this.feedbackButtons, this.feedbackChart]);

		this.onBefore('activate', function () {
			// remove x-axis ticks and labels at initialization
			this.feedbackChart.getAxes()[1].sprites[0].attr.majorTicks = false;
		});
	},

	updateChart: function (feedbackValues) {
		var chart = this.feedbackChart;
		var store = chart.getStore();

		/* Swap values for "can follow" and "faster, please" feedback
		 * TODO: improve implementation, this is a quick hack for MoodleMoot 2013 */
		var values = feedbackValues.slice();
		var tmpValue = values[0];
		values[0] = values[1];
		values[1] = tmpValue;
		if (!Ext.isArray(values) || values.length != store.getCount()) return;

		// Set chart data
		store.each(function (record, index) {
			record.set('value', values[index]);
		});

		// Calculate percentages
		var sum = store.sum('value');
		store.each(function (record) {
			record.set('percent', sum > 0 ? (record.get('value') / sum) : 0.0);
		});

		chart.getAxes()[0].setMaximum(Math.max.apply(null, values));
		chart.redraw();
	},

	updateTabBar: function (averageFeedback) {
		// update feedback-badge in tab bar
		ARSnova.app.mainTabPanel.tabPanel.feedbackTabPanel.tab.setBadgeText(this.feedbackChart.getStore().sum('value'));

		// change the feedback tab bar icon
		var tab = ARSnova.app.mainTabPanel.tabPanel.feedbackTabPanel.tab;
		switch (averageFeedback) {
			case 0:
				tab.setIconCls("voteIcons icon-wink");
				break;
			case 1:
				tab.setIconCls("voteIcons icon-happy");
				break;
			case 2:
				tab.setIconCls("voteIcons icon-shocked");
				break;
			case 3:
				tab.setIconCls("voteIcons icon-sad");
				break;
			default:
				tab.setIconCls("voteIcons icon-radar");
				break;
		}
	},

	checkTitle: function () {
		var title = Ext.util.Format.htmlEncode(localStorage.getItem('shortName'));
		this.toolbar.setTitle(title);
	}
});
