// a userscript by luke (and claude realistically)

(function () {
  'use strict';

  const navStructure = {
    'accounts': {
      'create': 'create/',
    },
    'admin': {
      'api': {
        '_path': '../../api',
        'docs': 'v1.0/docs/',
        'tokens': 'tokens/',
      },
      'backups': '../backups/',
      'feature flags': 'feature_flags/',
      'settings': {
        'update': 'update/',
      },
      'view log files': 'logs/',
    },
    'chargify': {
      'settings': {
        'update': 'update/',
        'sync_steps': {
          'generate_evergreen_transactions': 'generate_evergreen_transactions/update/',
          'get_components': 'get_components/update/',
          'get_credit_notes': 'get_credit_notes/update/',
          'get_customers': 'get_customers/update/',
          'get_email_events': 'get_email_events/update/',
          'get_invoices': 'get_invoices/update/',
          'get_payments': 'get_payments/update/',
          'get_products': 'get_products/update/',
          'get_refunds': 'get_refunds/update/',
          'get_reissued_invoices': 'get_reissued_invoices/update/',
          'get_subscriptions': 'get_subscriptions/update/',
          'get_voided_invoices': 'get_voided_invoices/update/',
          'send_credit_applications': 'send_credit_applications/update/',
          'send_customer_updates': 'send_customer_updates/update/',
          'send_customers': 'send_customers/update/',
          'send_payments': 'send_payments/update/',
        }
      },
      'subscriptions': {
        'list': 'view/unfiltered',
        ':id': {
          'update': 'update/',
        }
      }
    },
    'contracts': {
      'list': 'view/unfiltered',
      ':id': {
        'add transactions': 'add_transactions/create_transactions/',
        'add invoice': 'invoices/build/create/',
        'clone': 'clone/',
        'delete': 'delete/',
        'move': 'move/',
        'update': 'update/',
      }
    },
    'customers': {
      'home': 'home/',
      'list': 'view/unfiltered',
      'create': 'create/',
      ':id': {
        'add contract': 'contracts/create/',
        'add invoice': 'add_invoice/',
        'add transaction': 'add_transaction/',
        'delete': 'delete/',
        'update': 'update/'
      }
    },
    'import': {
      'create': 'select_file/insert/',
      'create and update': 'select_file/insert_update/',
      'update': 'select_file/update/',
      'delete': 'select_file/delete/',
      'item groups': 'metrics/add/upload/',
      'manage maps': 'maps/',
      'renumber': 'select_file/renumber/',
      'rename items': 'items/rename/upload/',
      'results': 'result_list/',
    },
    'invoices': {
      'full preview': 'full/',
      'home': 'home/',
      'invoice line items': {
        '_path': '../ilis',
        'list': 'view/unfiltered',
        ':id': {
          'update': 'update/',
          'delete': 'delete/',
          'associate_with_transaction': 'associate_with_transaction/',
        }
      },
      'view': 'view/unfiltered',
      ':id': {
        'update': 'build/',
        'create credit memo': 'create_credit_memo/',
        'clone': 'clone/',
        'void': 'void/',
        'delete': 'delete/'
      }
    },
    'lists': {
      '_path': '../so',
      'bulk update results': 'bulk_update_results/',
      'custom fields': 'dynamic_field_labels/',
      'deposits': 'payments/deposits/view/unfiltered/',
      'export results': 'export_results/',
      'items': {
        '_path': 'items',
        'home': 'home/',
        'create': 'create/',
        'needs maxio profile': 'view/unfiltered/?needs_so_profile=1',
        ':id': {
          'clone': 'clone/',
          'update': 'update/',
          'delete': 'delete/',
          'recast mrr': 'recast_mrr/'
        }
      },
      'payments': 'payments/list/',
      'registers': 'registers/',
    },
    'netsuite': {
      'settings': {
        'update': 'update/',
        'get steps': {
          '_path': '../settings',
          'get accounts': 'sync_steps/get_accounts/update/',
          'get credit memos': 'read_mapping/get_credit_memos/update/',
          'get currencies': 'sync_steps/get_currencies/update/',
          'get customers': 'read_mapping/get_customers/update/',
          'get invoices': 'read_mapping/get_invoices/update/',
          'get items': 'read_mapping/get_items/update/',
          'get legacy tax schedules': 'sync_steps/get_tax_schedules/update/',
          'get payment methods': 'sync_steps/get_payment_methods/update/',
          'get payment terms': 'sync_steps/get_payment_terms/update/',
          'get payments': 'read_mapping/get_payments/update/',
          'get refunds': 'read_mapping/get_refunds/update/',
        },
        'send steps': {
          '_path': '../settings',
          'send credit memos': 'write_mapping/send_credit_memos/update/',
          'send customer updates': 'write_mapping/send_customer_updates/update/',
          'send customers': 'write_mapping/send_customers/update/',
          'send deposits': 'sync_steps/send_deposits/update/',
          'send invoices': 'write_mapping/send_invoices/update/',
          'send items': 'sync_steps/send_items/update/',
          'send payments': 'write_mapping/send_payments/update/',
          'send refunds': 'write_mapping/send_refunds/update/',
        }
      },
    },
    'transactions': {
      'home': 'home/',
      'view unfiltered': 'view/unfiltered/',
      ':id': {
        'balance': 'balance/',
        'cancel': 'cancel/',
        'clone': 'clone/',
        'renew': 'renew/',
        'update': 'update/',
        'update ilis': 'ilis/update/',
      }
    },
    'users': {
      'home': '',
      'create': 'create/',
      'active users': '?is_active=1',
      'inactive users': '?is_active=0',
      ':id': {
        'change password': 'change_password/',
        'deactivate': 'deactivate/',
        'preferences': 'preferences/update',
        'update': 'update/',
      }
    },
  };

  // Get current path relative to /so/
  const fullPath = window.location.pathname;
  const soSegments = fullPath.split('/so/');
  if (soSegments.length < 2) return; // skip if root or not in /so/

  const basePath = soSegments[0] + '/so/';
  const relativePath = soSegments[1];
  const parts = relativePath.split('/').filter(part => part.length > 0);

  const breadcrumbContainer = document.createElement('div');
  breadcrumbContainer.className = 'core-navbar';
  breadcrumbContainer.style.cssText = `
        padding: 10px;
        background: #f5f5f5;
        margin-bottom: 10px;
        position: relative;
        font-family: Arial, sans-serif;
    `;

  // Start with root dropdown
  let breadcrumbHTML = createDropdown('home', navStructure, basePath);

  // Build remaining breadcrumbs
  let accumulatedPath = basePath;
  let dynamicContext = {}; // Track ID positions

  parts.forEach((part, index) => {
    accumulatedPath += part + '/';
    const isLast = index === parts.length - 1;
    const currentNav = getNavOptions(parts.slice(0, index + 1));
    let displayName = part.replace(/-/g, ' ');
    const parentNav = index > 0 ? getNavOptions(parts.slice(0, index)) : navStructure;
    if (parentNav) {
      const foundKey = Object.keys(parentNav).find(key => {
        const val = parentNav[key];
        return (typeof val === 'object' && val._path === part) || key === part;
      });
      if (foundKey) displayName = foundKey.replace(/-/g, ' ');
    }

    // Check if current part is an ID (numeric)
    const isID = /^\d+$/.test(part);
    if (isID) {
      dynamicContext[parts[index - 1]] = part; // Store ID context for parent resource
    }

    // Handle ID-aware navigation
    let options = currentNav;
    if (isID && currentNav === null) {
      // Check if parent resource has ID-aware routes
      const parentNav = getNavOptions(parts.slice(0, index));
      if (parentNav && parentNav[':id']) {
        options = parentNav[':id'];
      }
    }

    if (options) {
      breadcrumbHTML += ` › ${createDropdown(
        displayName,
        options,
        accumulatedPath,
        dynamicContext
      )}`;
    } else if (isLast) {
      breadcrumbHTML += ` › <span>${displayName}</span>`;
    } else {
      breadcrumbHTML += ` › <a href="${accumulatedPath}">${displayName}</a>`;
    }
  });

  breadcrumbContainer.innerHTML = breadcrumbHTML;
  addDropdownStyles();

  const existingNav = document.querySelector('nav.breadcrumbs');
  if (existingNav) {
    existingNav.parentNode.insertBefore(breadcrumbContainer, existingNav);
  } else {
    document.body.insertBefore(breadcrumbContainer, document.body.firstChild);
  }

  function createDropdown(title, options, basePath, context = {}) {
    if (typeof options !== 'object' || options === null) {
      return `<a href="${basePath}">${title}</a>`;
    }

    const items = Object.entries(options).filter(([key]) => key !== '_path').map(([key, value]) => {
      let path;
      const usePath = typeof value === 'object' && value._path !== undefined;
      const pathKey = usePath ? value._path : key;

      if (typeof value === 'string') {
        path = basePath + value.replace(/:id/g, context[key] || '');
      } else {
        path = basePath + pathKey.replace(/:id/g, context[key] || '') + '/';
      }

      Object.entries(context).forEach(([resource, id]) => {
        path = path.replace(`:${resource}_id`, id);
      });

      // Check if this item has nested options
      if (typeof value === 'object' && value !== null) {
        const newTitle = key.replace(/-/g, ' ').replace(/:id/, '');
        if (newTitle === '' || newTitle === '/') { return ''; } // Skip empty links
        const nestedDropdown = createDropdown(
          key.replace(/-/g, ' ').replace(/:id/, ''),
          value,
          path,
          context
        );
        return `<div class="dropdown">${nestedDropdown}</div>`;
      }

      return `<a href="${path}">${key.replace(/-/g, ' ').replace(/:id/, '')}</a>`;
    }).join('');

    return `
        <div class="dropdown">
            <a href="${basePath}">${title}</a>
            <div class="dropdown-content">${items}</div>
        </div>
    `;
  }

  function getNavOptions(pathParts) {
    return pathParts.reduce((currentLevel, part) => {
      if (!currentLevel || typeof currentLevel !== 'object') return null;

      // Check for _path match first
      const pathMatchKey = Object.keys(currentLevel).find(key => {
        const val = currentLevel[key];
        return typeof val === 'object' && val._path === part;
      });
      if (pathMatchKey) return currentLevel[pathMatchKey];

      // Then check exact match
      if (currentLevel[part]) return currentLevel[part];

      // Then check ID placeholder
      if (currentLevel[':id'] && /^\d+$/.test(part)) return currentLevel[':id'];

      return null;
    }, navStructure);
  }

  function addDropdownStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .dropdown {
            display: inline-block;
            position: relative;
        }

        /* Add buffer zone for hover retention */
        .dropdown-content::before {
            content: '';
            position: absolute;
            top: -8px;
            left: 0;
            right: 0;
            height: 8px;
        }

        /* Top-level dropdown */
        .core-navbar > .dropdown > .dropdown-content {
            top: 100%;
            left: 0;
            margin-top: 0;
            transition: opacity 0.2s;
        }

        /* Nested dropdowns */
        .dropdown-content .dropdown-content {
            top: -8px;
            left: 100%;
            margin-left: 0;
        }

        .dropdown-content {
            display: block;
            opacity: 0;
            visibility: hidden;
            position: absolute;
            background: white;
            min-width: 180px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            padding: 8px 0;
            z-index: 1000;
            border-radius: 4px;
            transition: opacity 0.2s, visibility 0.2s;
        }

        .dropdown:hover > .dropdown-content {
            opacity: 1;
            visibility: visible;
            transition-delay: 0.1s;
        }

        /* Keep dropdown open when hovering content */
        .dropdown-content:hover {
            opacity: 1;
            visibility: visible;
        }

        .dropdown > a {
            display: inline-block;
            padding: 2px 4px;
            position: relative;
        }

        .dropdown-content a {
            display: block;
            padding: 8px 16px;
            color: #333;
            text-decoration: none;
            white-space: nowrap;
        }

        .dropdown-content .dropdown {
            display: block;
        }

        .dropdown-content .dropdown > a {
            padding: 8px 16px;
            display: block;
        }

        .dropdown-content a:hover {
            background: #f5f5f5;
        }

        .core-navbar > * {
            margin-right: 4px;
        }

        .core-navbar a {
            color: #0066cc;
            text-decoration: none;
        }
    `;
    document.head.appendChild(style);
  }
})();
