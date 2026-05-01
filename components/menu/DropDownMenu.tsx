import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical, Copy, Download, PenLine, Trash2, Share2, Info, Eye } from 'lucide-react';

export interface MenuAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick: (e: React.MouseEvent) => void;
    danger?: boolean;
}

interface DropdownMenuProps {
    actions: MenuAction[];
    position?: 'top' | 'bottom' | 'left' | 'right';
    customButton?: React.ReactNode;
    onOpenChange?: (isOpen: boolean) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
    actions,
    position = 'top',
    customButton,
    onOpenChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onOpenChange?.(false);
            }
        };

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                onOpenChange?.(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen, onOpenChange]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newState = !isOpen;
        setIsOpen(newState);
        onOpenChange?.(newState);
    };

    const handleAction = (action: MenuAction, e: React.MouseEvent) => {
        e.stopPropagation();
        action.onClick(e);
        setIsOpen(false);
        onOpenChange?.(false);
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full mb-2';
            case 'left':
                return 'right-full mr-2';
            case 'right':
                return 'left-full ml-2';
            default:
                return 'top-full mt-2';
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            {/* Menu Button */}
            {customButton ? (
                <div onClick={toggleMenu}>
                    {customButton}
                </div>
            ) : (
                <button
                    ref={buttonRef}
                    onClick={toggleMenu}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Menu"
                >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`absolute ${getPositionClasses()} right-0 z-50 min-w-[200px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
                    <div className="py-2">
                        {actions.map((action) => (
                            <button
                                key={action.id}
                                onClick={(e) => handleAction(action, e)}
                                className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-gray-50 ${action.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                                    }`}
                            >
                                <span className="flex-shrink-0">{action.icon}</span>
                                <span className="flex-1 text-left">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;