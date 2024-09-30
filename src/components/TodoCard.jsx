import React from "react";
import "./todoList.css"; // Asegúrate de definir los estilos en tu archivo CSS

const TodoCard = ({ task, onDelete, onMarkAsCompleted, calculateTimeRemaining }) => {
    const isTaskExpired = calculateTimeRemaining(task.fecha) === "Tarea caducada";

    return (
        <div
            className={`card mb-3 ${task.completada ? "bg-success" : ""} ${isTaskExpired ? "tarea-caducada" : ""}`} // Agrega clase si está caducada
        >
            <div className="card-body">
                <h5 className="card-title">{task.tarea}</h5>
                <p className="card-text">Fecha límite: {task.fecha}</p>
                <p className={`card-text ${isTaskExpired ? "text-danger" : ""}`}>
                    {calculateTimeRemaining(task.fecha)}
                </p>
                <div className="d-flex justify-content-between">
                    <button
                        className={`btn ${task.completada ? "btn-warning" : "btn-success"}`}
                        onClick={onMarkAsCompleted}
                    >
                        {task.completada ? "Incompleta" : "Completada"}
                    </button>
                    <button className="btn btn-danger" onClick={onDelete}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodoCard;
