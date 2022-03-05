import React from 'react';

export function CheckAllRequiredFields(callback) {
    let isValid = true;
    const requiredFields = document.querySelectorAll('.required');
    requiredFields.forEach((field) => {
        if (
            isValid &&
            (field.value === '' ||
                field.value?.trim() === '' ||
                (field.type === 'number' && field.value === 0))
        )
            isValid = false;
    });
    callback(isValid);
}
