/*--------------------------------------------------------------------------+
 This file is part of ARSnova.
 app/model/Statistic.js
 - Beschreibung: Statistic-Model
 - Version:      1.0, 01/05/12
 - Autor(en):    Christian Thomas Weber <christian.t.weber@gmail.com>
 +---------------------------------------------------------------------------+
 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 as published by the Free Software Foundation; either version 2
 of the License, or any later version.
 +---------------------------------------------------------------------------+
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 +--------------------------------------------------------------------------*/
Ext.define('ARSnova.model.Statistic', {
	extend: 'Ext.data.Model',
	
	config: {
		proxy: restProxy,
		fields: [
		   	  'category', 
		   	  'counter'
		       ],
	},
    
    countSessions: function(callbacks){
    	return this.proxy.countSessions(callbacks);
    },
    
    countActiveUsers: function(callbacks){
    	return this.proxy.countActiveUsers(callbacks);
    },
    
    countActiveUsersWithSessionId: function(callbacks){
    	return this.proxy.countActiveUsersWithSessionId(callbacks);
    },
    
    countActiveSessions: function(callbacks){
    	return this.proxy.countActiveSessions(callbacks);
    }
});