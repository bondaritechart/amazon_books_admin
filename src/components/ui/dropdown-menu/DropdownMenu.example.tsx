import React from 'react';
import { DropdownMenu, DropdownMenuItem } from './DropdownMenu';
import { Button } from '../Button/Button';

// Example icons (you can replace these with your preferred icon library)
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m18.5 2.5 a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="6,9 12,15 18,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DropdownMenuExamples: React.FC = () => {
  // Basic menu items
  const basicMenuItems: DropdownMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      onClick: () => alert('Edit clicked'),
    },
    {
      id: 'share',
      label: 'Share',
      icon: <ShareIcon />,
      onClick: () => alert('Share clicked'),
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      onClick: () => alert('Delete clicked'),
    },
  ];

  // Menu with disabled items
  const menuWithDisabled: DropdownMenuItem[] = [
    {
      id: 'save',
      label: 'Save',
      onClick: () => alert('Save clicked'),
    },
    {
      id: 'save-as',
      label: 'Save As...',
      onClick: () => alert('Save As clicked'),
    },
    {
      id: 'export',
      label: 'Export',
      disabled: true,
      onClick: () => alert('Export clicked'),
    },
    {
      id: 'print',
      label: 'Print',
      onClick: () => alert('Print clicked'),
    },
  ];

  // Menu with links
  const menuWithLinks: DropdownMenuItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      href: '/profile',
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      onClick: () => {
        console.log('Logging out...');
        // Handle logout logic
      },
    },
  ];

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2>DropdownMenu Examples</h2>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h3>Basic Dropdown (bottom-left)</h3>
        <DropdownMenu
          trigger={
            <Button variant="secondary">
              Actions <ChevronDownIcon />
            </Button>
          }
          items={basicMenuItems}
          position="bottom-left"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h3>With Disabled Items (bottom-right)</h3>
        <DropdownMenu
          trigger={
            <Button variant="primary">
              File <ChevronDownIcon />
            </Button>
          }
          items={menuWithDisabled}
          position="bottom-right"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h3>User Menu (top-right)</h3>
        <DropdownMenu
          trigger={
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '8px',
              backgroundColor: '#f3f4f6',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                JD
              </div>
              <span>John Doe</span>
              <ChevronDownIcon />
            </div>
          }
          items={menuWithLinks}
          position="top-right"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h3>Custom Trigger</h3>
        <DropdownMenu
          trigger={
            <div style={{
              padding: '0.5rem 1rem',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚙️ Options
            </div>
          }
          items={basicMenuItems}
          position="bottom-left"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <h3>Disabled Dropdown</h3>
        <DropdownMenu
          trigger={
            <Button variant="secondary" disabled>
              Disabled <ChevronDownIcon />
            </Button>
          }
          items={basicMenuItems}
          disabled={true}
        />
      </div>
    </div>
  );
}; 