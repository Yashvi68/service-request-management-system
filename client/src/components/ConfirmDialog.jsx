import { useEffect, useRef } from 'react'
import './ConfirmDialog.scss'

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', busy, onConfirm, onCancel }) {
    const cancelRef = useRef(null)

    useEffect(() => {
        cancelRef.current?.focus()
    }, [])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape' && !busy) {
                onCancel()
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [busy, onCancel])

    return (
        <div className="modal-backdrop">
            <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
                <h2 id="confirm-title">{title}</h2>
                <p>{message}</p>
                <div className="button-row">
                    <button ref={cancelRef} type="button" className="button secondary" onClick={onCancel} disabled={busy}>
                        Cancel
                    </button>
                    <button type="button" className="button danger solid" onClick={onConfirm} disabled={busy}>
                        {busy ? 'Deleting...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
